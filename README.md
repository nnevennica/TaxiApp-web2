**1. OPIS ZADATKA**

Realizovati taxi aplikaciju. Postoje tri vrste korisnika ovog sistema:
1. Administrator
2. Korisnik
3. Vozač
   
**2.Funkcije sistema**

     2.1. Prikaz informacija neregistrovanim korisnicima
Prva stranica koju (neregistrovan) korisnik vidi je početna stranica aplikacije na kojoj je moguće ili ulogovati 
se ukoliko je korisnik već registrovan na sistem ili preći na stranicu za registraciju/prijavu na sistem
![Screenshot (127)](https://github.com/user-attachments/assets/b5fe96af-30d4-472b-8b6b-52341367ab44)
   

     2.2. Registracija korisnika i prijavljivanje na sistem
Na stranici za registraciju/prijavu na sistem pomoću korisnikove email adrese i lozinke može se izvršiti 
prijava.
Ukoliko korisnik još uvek nije registrovan na sistem, a želi da koristi funkcije aplikacije, mora prvo da se 
registruje na odgovarajućoj stranici. Registracija je moguća na dva načina. Prvi je takozvana klasična 
registracija - unosom ličnih podataka koji obuhvataju: email adresu, lozinku, ime, prezime, datuma rođenja 
i adresu. Lozinka se unosi u dva polja da bi se otežalo pravljenje grešaka prilikom odabira nove lozinke. 
Nakon registracije administrator treba da potvrdi registraciju. I drugi način – putem neke društvene mreže.
Napomena: Potrebno je implementirati oba pristupa (Jedna društvena mreža je dovoljna). Prilikom 
registracije potrebno je definisati:

• Korisničko ime

• Email

• Lozinku

• Ime i prezime

• Datum rođenja

• Adresa

• Tip korisnika – Administrator, Korisnik ili Vozač

• Sliku korisnika - Omogućiti upload slike;

Napomena: Za maksimalan broj bodova slika se mora zaista čuvati na serveru i skidati za 
prikaz!


![Screenshot (128)](https://github.com/user-attachments/assets/aefc2293-f620-4fc3-a733-3bfac6871644)


    2.3. Profil korisnika
Registrovani korisnik je u mogućnosti da ažurira svoje lične podatke na stranici za prikaz svog profila


    2.4 Postupak verifikovanja registracije
Administrator ima mogućnost pregledanja podataka pri čemu određeni zahtev može da prihvati ili odbije. 
Nakon prihvatanja, profil postaje aktivan. Verifikacija se radi za vozače. Tek kada su verifikovani mogu da 
počnu da rade, dok obični korisnici nemaju potrebnu verifikaciju.
Korisnik na svom profilu ima indikaciju o statusu procesa verifikacije (zahtev se procesira, zahtev je
prihvaćen ili je odbijen). Poslati email kao notifikaciju prilikom verifikacije

![Screenshot (130)](https://github.com/user-attachments/assets/47dbd5bf-a90f-467d-949f-d37af939ac68)


    2.5. Dashboard
Nakon uspešnog logovanja korisnik je redirektovan na stranicu Dashboard-a. Na njoj se nalaze
sledeći elementi, koji će biti detaljno opisani u narednim poglavljima:

• Profil (svi)

• Nova vožnja (Korisnik)

• Prethodne vožnje (Korisnik)

• Verifikacija (Admin)

• Nove vožnje (Vozač)

• Moje vožnje (Vozač)

• Sve vožnje (Admin)

        2.5.1. Profil
      
Prikaz i izmena profila korisnika.

      2.5.2. Nova vožnja
      
Kreiranje nove vožnje vrši se unosom početne i krajnje adrese. Nakon unosa potrebno je da korisnik klikne 
Poruči, sistem zatim vrši predviđanje cene u odnosu na udaljenost (moguće je i random definisati). Pored 
cene potrebno je da sistem izvrši i predviđanje vremena čekanja da vozač dođe do korisnika. Ukoliko 
korisniku odgovara cena vožnje i vreme čekanja potrebno je da klikne na novo dugme Potvrdi. Svim 
vozačima prikazuje se nova vožnja u listi vožnji koje čekaju da budu prihvaćene. Nakon prihvatanja 
odredjuje se vreme koje je potrebno od početne adrese do korisnikove krajnje destinacije (može se koristiti 
random vreme).

Nakon kreirane nove vožnje i nakon prihvatanja estimacije, korisnik nije u mogućnosti da koristi ostale 
funkcionalnosti sistema. Jedino što može da vidi jeste:

1) Odbrojavanje do dolaska vozača – potrebno je implementirati odbrojavanje vremena real-time
2) Odbrojavanje do kraja vožnje
   
Nakon što se vožnja završi, korisnik ponovo može da koristi ostatak funkcionalnosti sistema.
Nakon što vozač prihvati vožnju, za njega važe ista pravila.
Po završetku vožnje korisnik dobija mogućnost ocenjivanja vozača od 1 do 5 zvezdica. Prosečnu ocenu 
vozača može da vidi samo admin i da u odnosu na to blokira vozače. Takodje može i da ih odblokira nakon 
toga.

*** Blokiran vozač može da se prijavi na sistem ali ne može da prihvata vožnje.

![Screenshot (131)](https://github.com/user-attachments/assets/4650df18-d609-4bec-b15f-bd78a3740072)

![Screenshot (132)](https://github.com/user-attachments/assets/6da12b75-da35-41be-8843-acf5831db4ac)

![Screenshot (133)](https://github.com/user-attachments/assets/5ae1185b-e997-4ef9-b526-448a9400e53d)


      2.5.3. Verifikacija
      
Administrator vidi listu vozača kao i njihov status, može da im odobri ili odbije status i vidi koji su 
odobreni.

      2.5.4. Prethodne vožnje
      
Korisnik može da vidi listu svojih prethodnih vožnji.

      2.5.5. Nove vožnje
      
Vozač vidi spisak novih vožnji koje čekaju da budu prihvaćene

      2.5.6. Moje vožnje
      
Vozač može da vidi prethodne vožnje koje je završio.

      2.5.7. Sve vožnje
      
Administrator ima uvid u sve vožnje kao i njihov status

**Implementacija sistema**

    3.1. Serverske platforme
    
Za realizaciju projekta koristi se serverska platforma:

• .NET CORE, Microsoft Service Fabric

    3.2 Klijentske platforme
    
Za realizaciju projekta koristi se:

• Single-page interface aplikacija u Reactu Vizuelni izgled aplikacije utiče na ocene 7 i više.

    3.3 Slanje e-maila
    
Za slanje emaila nije obezbeđen poseban servis. Možete koristiti sopstveni email nalog.

    3.4 Konkurentni pristup resursima
  
Važno je da više istovremenih korisnika aplikacije, ne može da radi nad istim elementom u istom 
vremenskom periodu. Pored navedenog ograničenja, svaki student treba da pronađe još po jednu 
konfliktnu situaciju za svoj deo zahteva i adekvatno je reši.

Napomena: Nije dovoljno zašititi klijent, potrebno je isto to uraditi sa serverom! Dakle probati 
postmanom/swaggerom na primer da li je moguće obrisati/modifikovati entitet koji ne postoji. Rukovati 
izuzecima na prednjoj i zadnjoj strani. Napraviti model na prednjoj strani, tako da ukoliko se izmeni model 
na zadnjoj strani, je dovoljno da se izmena uradi samo na jednom mestu na prednjoj strani.

Napomena: Mora se koristiti Git za kontrolu verzija i repozitorijum mora biti na GitHubu dostupan 
predavačima na uvid prilikom izrade i odbrane projekta.

    3.5 Arhitektura rešenja i kriterijumi ocenjivanja
    
U projektu se moraju ispoštovati kriterijumi kvaliteta rešenja i dobre prakse u izradi web aplikacija 
pokazane na vežbama.

1. Prednja strana aplikacije mora biti podeljena po komponentama
2. URL-ovi eksternih servisa koji se gađaju sa prednje strane moraju biti u .env fajlu i iščitavati se
odatle, ovo uključuje i URL zadnje strane aplikacije.
3. HTTP pozivi sa prednje strane moraju biti u servisima koji se injektuju u komponente, nikako 
direktno u komponentama.
4. Moraju postojati modeli na prednjoj strani
5. Obavezna mikroservisna arhitektura na zadnjoj strani.
6. Moraju postojati Dto i modeli baze podataka kao odvojeni modeli i mora postojati adekvatno 
mapiranje između njih.
7. Mora biti ispoštovana REST konvencija za nazivanje resursa.
8. Lozinke u bazi podataka moraju biti heširane
9. Potpis i istek tokena moraju biti validirani
10. Konfigurabilne podatke (lozinke eksternih servisa, URL-ove) na zadnjoj strani držati u 
appsettings.json fajlu i učitavati.


