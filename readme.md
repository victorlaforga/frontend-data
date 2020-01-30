# KidsTreasures

Deze applicatie visualiseert alle speelgoed van kinderen die ze vroeger gebruikten. De applicatie maakt gebruik van de D3 library en de database van het NMVW (Nationaal Museum Van Wereldculturen). Binnen de applicatie zelf kan je op continent filteren. Ook kan je het speelgoed sorteren op lengte (hoog-laag & laag-hoog)

![](https://user-images.githubusercontent.com/37700441/73372973-570b5e80-42b8-11ea-8c15-40065dc4f161.png)

## Waar komt de data vandaan?
Deze 4 musea hebben 1 grote database samen waarin bijna alle voorwerpen in staan die hierbij horen.

![](https://user-images.githubusercontent.com/37700441/67966655-91efee80-fc04-11e9-9d4b-543a5d4df321.png)

De NMVW werkt met sparql als database omgeving.
Om de collectie te bekijken verwijs ik je naar: [https://collectie.wereldculturen.nl/](https://collectie.wereldculturen.nl/)

## Wat moet je doen om het project werkend te krijgen op je eigen laptop? :computer:
1. Open je terminal
2. Kopier de volgende regel en zet die in je terminal `git clone https://github.com/victorlaforga/frontend-data.git`
3. Ga naar je folder doormiddel van `cd frontend-data`
4. Zorg dat je verbonden bent met een internetverbinding. Anders werkt het data ophalen niet.
5. Om de applicatie te runnen open het bestan index.html

## SparQL & data

Deze Query heb ik gebruikt om de data op te halen. Hierin haal ik de plek van het object, regio, titel, afbeelding, lengte & het continent ervan.

```javascript
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
SELECT ?lengte ?cho ?placeRegioName ?title ?pic ?continentLabel WHERE {
?cho edm:isRelatedTo <https://hdl.handle.net/20.500.11840/termmaster1832> .
?cho dct:spatial ?place .
?cho dc:title ?title .
?cho edm:isShownBy ?pic .
?place skos:broader ?placeRegio .
?placeRegio skos:prefLabel ?placeRegioName .
  ?cho dct:extent ?lengte.
  <https://hdl.handle.net/20.500.11840/termmaster2> skos:narrower ?continent .
    ?continent skos:prefLabel ?continentLabel .
    ?continent skos:narrower* ?place .
} GROUP BY ?continentLabel
`
```
Vervolgens zet ik de data om in een json bestand. Ik gebruik async en await omdat ik wacht tot er een promise wordt uitgevoerd.

```javascript
export async function runQuery (url, query) {
    // Call the url with the query attached, output data
    let fetched = await fetch(url + "?query=" + encodeURIComponent(query) + "&format=json")
      .then(res => res.json())
      .then(json => {
        const dataArray = json.results.bindings;
        return dataArray;
      });
    return fetched;    
  };
```

## Features

Speelgoed voor kinderen...
* filteren op basis van continent van herkomst
* sorteren op lengte van hoog naar laag & van laag naar hoog
* Titel, afbeelding & regio bekijken van het geselecteerde speelgoeditem.

## Mijn Wiki

Voor meer informatie verwijs ik je naar [Mijn Wiki](https://github.com/victorlaforga/frontend-data/wiki)


