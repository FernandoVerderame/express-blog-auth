## Esercizio di oggi: Express Blog Auth

Creiamo le seguenti rotte:

1. home

2. posts/ (index)

3. posts/ (store)

4. posts/:slug (show)

Tramite JTW creiamo una rotta per autenticare un utente ed ottenere il Token JWT e tramite un middleware limitiamo l'accesso alla rota `store` dei post ai soli utenti loggati.

Gestiamo, attraverso dei middlewares, gli errori e le pagine 404.

Questi middleware dovranno rispondere con un json contente il codice ed il messaggio dell'errore.

Svolgiamo tutto l'esercizio tramite relativi controller e router.

### BONUS

Ritornare un errore diverso nel caso il jwt sia non valido o scaduto.

Creare un middleware per proteggere le rotte riservate agli utenti admin.