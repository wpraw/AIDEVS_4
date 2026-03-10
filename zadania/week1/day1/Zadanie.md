Zadanie

Pobierz listę osób, które przeżyły 'Wielką Korektę' i które współpracują z systemem. Znajdziesz ją w pliku people.csv

Wiemy, że do organizacji transportów między elektrowniami angażowani są ludzie, którzy:

są mężczyznami, którzy teraz w 2026 roku mają między 20, a 40 lat

urodzonych w Grudziądzu

pracują w branży transportowej

Każdą z potencjalnych osób musisz odpowiednio otagować. Mamy do dyspozycji następujące tagi:
IT
transport
edukacja
medycyna
praca z ludźmi
praca z pojazdami
praca fizyczna

Jedna osoba może mieć wiele tagów. Nas interesują tylko ludzie pracujący w transporcie, którzy spełniają też poprzednie warunki.

Prześlij nam listę osób, którymi powinniśmy się zainteresować. Oczekujemy formatu odpowiedzi jak poniżej, wysłanego na adres https://hub.ag3nts.org/verify

Nazwa zadania to: people.

{
       "apikey": "tutaj-twój-klucz-api",
       "task": "people",
       "answer": [
         {
           "name": "Jan",
           "surname": "Kowalski",
           "gender": "M",
           "born": 1987,
           "city": "Warszawa",
           "tags": ["tag1", "tag2"]
         },
         {
           "name": "Anna",
           "surname": "Nowak",
           "gender": "F",
           "born": 1993,
           "city": "Grudziądz",
           "tags": ["tagA", "tagB", "tagC"]
         }
       ]
     }

Co należy zrobić w zadaniu?


Pobierz dane z hubu - plik people.csv dostępny pod linkiem z treści zadania (wstaw swój klucz API z https://hub.ag3nts.org/). Plik zawiera dane osobowe wraz z opisem stanowiska pracy (job).



Przefiltruj dane - zostaw wyłącznie osoby spełniające wszystkie kryteria: płeć, miejsce urodzenia, wiek.



Otaguj zawody modelem językowym - wyślij opisy stanowisk (job) do LLM i poproś o przypisanie tagów z listy dostępnej w zadaniu. Użyj mechanizmu Structured Output, aby wymusić odpowiedź modelu w określonym formacie JSON. Szczegóły we Wskazówkach.



Wybierz osoby z tagiem transport - z otagowanych rekordów wybierz wyłącznie te z tagiem transport.



Wyślij odpowiedź - prześlij tablicę obiektów na adres https://hub.ag3nts.org/verify w formacie pokazanym powyżej (nazwa zadania: people).



Zdobycie flagi - jeśli wysłane dane będą poprawne, Hub w odpowiedzi odeśle flagę w formacie {FLG:JAKIES_SLOWO} - flagę należy wpisać pod adresem: https://hub.ag3nts.org/ (wejdź na tą stronę w swojej przeglądarce, zaloguj się kontem którym robiłeś zakup kursu i wpisz flagę w odpowiednie pole na stronie)