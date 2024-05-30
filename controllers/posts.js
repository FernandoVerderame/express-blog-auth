// Importo il modulo File System
const fs = require("fs");

// Importo il modulo Path
const path = require("path");

// Importo i posts
let posts = require("../db/posts.json");

// Index dei Posts
const index = (req, res) => {

    // Content negotiation
    res.format({

        // Logica HTML
        html: () => {
            let html = '<ul>';
            posts.forEach(({ title, content, image, tags, slug }) => {
                html += `
                <li>
                    <div>
                        <h3>${title}</h3>
                        <img width="300" height="200" src="/${image}" alt="${title}"/>
                        <p>${content}</p>
                        <p>${tags.map(t => `<strong><span class="tag">#${t.replaceAll(' ', '-').toLowerCase()}<span></strong>`).join(' ')}</p>
                        <a href="http://${req.headers.host}/posts/${slug}">Visualizza immagine</a>
                    </div>
                </li>
                `
            });
            html += '</ul>';
            res.send(html);
        },

        // Logica JSON
        json: () => {
            res.json({
                data: posts,
                count: posts.length
            });
        }
    });
}

// Show dei posts
const show = (req, res) => {
    // Recupero lo slug dai parametri
    const requestPostSlug = req.params.slug;

    // Provo a cercare se tra gli slug dei posts esiste una relazione
    const requestPost = posts.find(post => post.slug === requestPostSlug);


    res.format({

        //Logica HTML
        html: () => {
            if (requestPost) {
                const p = requestPost;
                res.send(`
                    <div>
                        <h3>${p.title}</h3>
                        <img width="300" height="200" src="/${p.image}" alt="${p.title}"/>
                        <p>${p.content}</p>
                        <p>${p.tags.map(t => `<strong><span class="tag">#${t.replaceAll(' ', '-').toLowerCase()}<span></strong>`).join(' ')}</p>
                        <a href="http://${req.headers.host}/${requestPost.image}">Visualizza immagine</a>
                        <a href="http://${req.headers.host}/posts/${requestPost.slug}/download">Download immagine</a>
                        <a href="http://${req.headers.host}/posts">Torna indietro</a>
                    </div>
                `);
            } else {

                // Restituisco un 404 se il post non esiste
                res.status(404).send(`<h1>Post non trovato</h1>`);
            }
        },

        // Logica JSON
        json: () => {

            // Se esiste
            if (requestPost) {
                res.json({
                    ...requestPost,
                    image_url: `http://${req.headers.host}/${requestPost.image}`,
                    image_download_url: `http://${req.headers.host}/posts/${requestPost.slug}/download`
                });
            } else {
                res.status(404).json({
                    error: 'Not Found',
                    description: `Non esiste un post con slug ${slugrequestPost}`
                });
            }
        }
    });
}

// Funzione per la creazione di un nuovo post
const create = (req, res) => {
    res.format({

        // Logica HTML
        html: () => {
            res.send('<h1>Creazione nuovo post</h1>');
        },

        // Altri casi
        default: () => {
            res.status(406).send('<h1>Not Acceptable</h1>');
        }
    });
}

// Funzione per il download delle immagini dei post
const file = (sendMethod) => {
    return (req, res) => {
        const slug = req.params.slug;
        const post = posts.find(post => post.slug === slug)

        if (!post) {
            res.status(404).send('File not found.');
            return;
        }

        const filePath = path.join(__dirname, `../public/${post.image}`);
        const extension = path.extname(filePath);
        if (extension !== '.jpeg') {
            res.status(400).send(`You are not allowed to access ${extension} files.`);
        } else if (fs.existsSync(filePath)) {
            res[sendMethod](filePath);
        }
    }
}

// Update dei posts
const updatePosts = (newPosts) => {
    const filePath = path.join(__dirname, '../db/posts.json');
    fs.writeFileSync(filePath, JSON.stringify(newPosts));
    posts = newPosts;
}

// Cancellazione di un file
const deletePublicFile = (fileName) => {
    const filePath = path.join(__dirname, '../public', fileName);
    fs.unlinkSync(filePath);
}

// Creazione dello slug
const createSlug = (title) => {
    const baseSlug = title.replaceAll(' ', '-').toLowerCase().replaceAll('/', '').replaceAll('\'', '-');
    const slugs = posts.map(p => p.slug);
    let counter = 1;
    let slug = baseSlug;
    while (slugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
    return slug;
}

// Store dei posts
const store = (req, res) => {

    // Leggere il contenuto del body
    const { title, content, tags } = req.body;

    // Controllo che il contenuto del body sia valido
    if (!title || title.replaceAll('/', '').trim().length === 0 || !content || !tags) {
        req.file?.filename && deletePublicFile(req.file.filename);
        return res.status(400).send('Some data is missing.');
    } else if (!req.file || !req.file.mimetype.includes('image')) {
        req.file?.filename && deletePublicFile(req.file.filename);
        return res.status(400).send('Image is missing or it is not an image file.');
    }

    // Genero lo slug
    const slug = createSlug(title);

    // Creo il nuovo Post
    const newPost = {
        title,
        content,
        tags,
        image: req.file.filename,
        slug
    }

    updatePosts([...posts, newPost]);

    res.format({

        // Redirect a Posts nel caso dell'HTML
        html: () => {
            // Logica HTML
            res.redirect(`http://${req.headers.host}/posts/${newPost.slug}`);
        },

        // Invio il JSON del nuovo Post
        json: () => {
            res.json({
                data: newPost
            });
        }
    });
}

// Destroy dei Posts
const destroy = (req, res) => {

    const { slug } = req.params;
    const deletePost = posts.find(p => p.slug === slug);

    deletePublicFile(deletePost.image);
    updatePosts(posts.filter(p => p.slug !== deletePost.slug));

    res.send(`Post con slug ${slug} eliminato con successo.`);
}

// Esporto i moduli
module.exports = {
    index,
    show,
    create,
    file,
    store,
    destroy
}