---
title: "Passer de Java à Kotlin"
description: "Retour d'expérience après trois ans : ce que Kotlin change vraiment face à un Java moderne — classes, data class et record, nullabilité, extensions, coroutines et interopérabilité."
pubDate: 2026-07-26
tags: [kotlin, java, jvm, coroutines]
---
*Retour d'expérience après trois ans, et comparaison avec un Java récent.*

---
Cela fait maintenant plus de trois ans que je suis passé de Java à Kotlin et je suis tombé amoureux du langage… je vous explique ça !

Ici, j'aimerais parler de quelques différences que j'ai pu voir entre Java et Kotlin, en termes de syntaxe et de fonctionnalités.

Autant le dire tout de suite : ça n'a pas été fluide dès le premier jour. J'ai mis un moment à me défaire de mes réflexes Java, et encore plus à comprendre à quoi servaient vraiment `when`, `let`, `apply` ou `also`. J'y reviens à la fin de l'article — mais commençons par le commencement : ce qu'est Kotlin, et pourquoi on le compare à Java.

---

## 1. Présentation de Kotlin

Kotlin a été dévoilé par JetBrains en 2011, publié en open source en 2012, et la version 1.0 est sortie en février 2016. Vous le connaissez sûrement comme le langage du développement Android — Google en a fait un langage officiel en 2017, puis son langage recommandé (« Kotlin-first ») en 2019. Mais il ne s'arrête pas là : il s'adapte aussi bien au back-end (Spring, Ktor, Quarkus…) qu'au front-end (Kotlin/JS, Kotlin/Wasm), et au multiplateforme avec Kotlin Multiplatform, stable depuis fin 2023.

C'est un langage orienté objet **et** fonctionnel, pensé comme une alternative moderne et plus productive à Java, tout en restant entièrement interopérable avec lui. Il vise à réduire certaines frictions : la verbosité, la gestion des `NullPointerException`, et l'absence de fonctionnalités devenues standard ailleurs.

> **Attention à ne pas caricaturer** — Java a beaucoup évolué depuis Java 8. Records, `var`, pattern matching, sealed classes, text blocks, virtual threads… beaucoup des « manques » historiques ont été comblés. Dans cet article, je compare avec un Java récent (17/21), pas avec Java 8.

JetBrains a aussi pensé aux gros projets Java existants, qu'il serait fastidieux de réécrire d'un coup : l'interopérabilité permet de migrer petit à petit, fichier par fichier, sans big bang.

---

## 2. Syntaxe et expressivité

### A. Les classes

Voici comment vous définiriez une classe simple en Java et en Kotlin :

```java
// Java

public class Personne {

    private final String nom;
    private final int age;

    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    public String getNom() {
        return nom;
    }

    public int getAge() {
        return age;
    }
}
```

```kotlin
// Kotlin

class Personne(val nom: String, val age: Int)
```

Une seule ligne, et sans accolades puisque le corps de la classe est vide. (Un Java récent écrirait plutôt un `record` ici — on y vient juste après. J'ai gardé la classe complète parce que c'est encore ce qu'on trouve dans la grande majorité des bases de code existantes, celles que l'on migre.)

Trois différences expliquent l'écart :

- **Les propriétés se définissent directement dans le constructeur** — le *constructeur primaire*, déclaré à même la définition de la classe. Pas de champs, pas de `this.x = x`.
- **Les getters sont générés.** Une propriété `val` expose un getter (`getNom()` vu depuis Java), une propriété `var` expose en plus un setter.
- **Les méthodes s'introduisent avec `fun`**, et leur corps s'écrit de deux façons :

```kotlin
// Kotlin

class Personne(private val nom: String, private val age: Int) {

    // Corps en bloc : le type de retour doit être déclaré dès que la
    // fonction retourne autre chose que Unit (l'équivalent de void).
    fun presentation(): String {
        return "Je m'appelle $nom et j'ai $age ans"
    }

    // Corps d'expression : le type est inféré (ici Boolean).
    fun estMajeur() = age >= 18
}
```

Une différence de fond, qu'on découvre souvent trop tard : **en Kotlin, les classes et leurs membres sont `final` par défaut**. Pour autoriser l'héritage d'une classe ou la redéfinition d'un membre, il faut généralement les déclarer `open` (« généralement », car c'est implicite pour les classes `abstract` et `sealed`, pour les membres d'une interface, pour les membres `abstract` et pour les `override`).

C'est un bon défaut, mais c'est le premier mur d'une migration : Spring, JPA et Mockito ont besoin de créer des proxies ou des sous-classes. On ajoute les plugins `all-open` / `no-arg` — ou `kotlin-spring` et `kotlin-jpa` qui les préconfigurent — et le problème disparaît. Encore faut-il le savoir avant d'y perdre une demi-journée.

### B. Data class et record

La **data class** génère automatiquement `equals()`, `hashCode()`, `toString()`, `copy()` et les fonctions `componentN()` :

```kotlin
// Kotlin

data class Personne(val nom: String, val age: Int)

fun main() {
    val personne = Personne("John", 24)

    println(personne)
    // Output: Personne(nom=John, age=24)

    println(personne.copy(age = 30))
    // Output: Personne(nom=John, age=30)
}
```

Trois choses à retenir au passage :

- `println(personne)` utilise implicitement le `toString()` généré par la data class, et le `equals()` généré compare les propriétés déclarées dans le constructeur primaire plutôt que la seule identité des instances.
- `copy()` effectue une copie **superficielle**.
- Lorsqu'une propriété du constructeur primaire est déclarée `private`, le `componentN()` correspondant est également privé, ce qui empêche la déstructuration depuis l'extérieur de la classe.

> **Le piège classique de la data class** — `equals()`, `hashCode()` et `toString()` ne prennent en compte **que les propriétés du constructeur primaire**. Une propriété déclarée dans le corps de la classe en est totalement absente :
>
> ```kotlin
> data class Point(val x: Int) {
>     var label: String = ""
> }
>
> val a = Point(1).apply { label = "A" }
> val b = Point(1).apply { label = "B" }
>
> println(a == b)   // true  (!)
> println(a)        // Point(x=1)  — label n'apparaît pas
> ```

Depuis **Java 16**, les **records** reprennent la même philosophie — génération de `equals()`, `hashCode()`, `toString()` et des accesseurs — pour des classes simples et immuables :

```java
// Java

public record Personne(String nom, int age) {}
```

```java
// Java

var personne = new Personne("John", 24);

System.out.println(personne);         // Personne[nom=John, age=24]
System.out.println(personne.nom());   // John — l'accesseur s'appelle nom()
```

La ressemblance est frappante, mais la data class va plus loin :

| Fonctionnalité | Kotlin `data class` | Java `record` |
|---|---|---|
| `equals()` / `hashCode()` / `toString()` | ✅ | ✅ |
| `copy()` | ✅ | ❌ (il faut reconstruire l'objet) |
| Déstructuration | ✅ partout | ✅ via *record patterns* (Java 21) |
| Paramètres par défaut / arguments nommés | ✅ | ❌ |
| Propriétés mutables | possible avec `var` | ❌ (champs toujours `final`) |
| Constructeur compact (validation) | ❌ (il faut un bloc `init`) | ✅ |
| Vrai type JVM `java.lang.Record` | via `@JvmRecord` (JVM 16+) | ✅ nativement |

La **déstructuration**, justement : Kotlin génère `component1()` pour `nom` et `component2()` pour `age`, ce qui permet d'écrire :

```kotlin
// Kotlin

fun main() {
    val (nom, age) = Personne("John", 24)
    println("Je m'appelle $nom et j'ai $age ans")
    // Output: Je m'appelle John et j'ai 24 ans
}
```

Attention, elle est **positionnelle** et non nominale : `val (age, nom) = personne` compile très bien et vous donne le mauvais résultat. Inverser deux propriétés du même type casse silencieusement tous les appelants.

Côté Java, l'équivalent existe depuis **Java 21** avec les *record patterns*, mais uniquement en pattern matching (`instanceof` ou `switch`), pas dans une simple affectation :

```java
// Java 21

static String decrire(Object o) {
    if (o instanceof Personne(String nom, int age)) {
        return "Je m'appelle %s et j'ai %d ans".formatted(nom, age);
    }
    return "Objet inconnu";
}
```

### C. Les variables

Kotlin déduit le type, et distingue deux déclarations : **`val` pour ce qui ne sera pas réaffecté, `var` pour le reste**. En pratique, on écrit `val` par défaut.

```kotlin
// Kotlin

val nom = "John"
nom = "Jean"        // erreur de compilation : val cannot be reassigned

var compteur = 0
compteur += 1       // OK
```

Attention, `val` rend la **référence** immuable, pas l'objet : `val liste = mutableListOf(1, 2)` interdit de réaffecter `liste`, mais `liste.add(3)` reste possible.

Pour être honnête, Java sait aussi inférer le type depuis **Java 10** (`var name = "John";`). La différence est de portée : le `var` de Java se limite aux variables locales — et, depuis Java 11, aux paramètres de lambda — alors que Kotlin infère aussi les propriétés de classe et le type de retour des fonctions à expression unique. L'équivalent de `val` existe côté Java (`final String s = …`), mais il est assez verbeux pour que presque personne ne l'écrive, alors qu'en Kotlin l'immuabilité est le choix par défaut, celui qui demande le moins de caractères.

J'apprécie aussi beaucoup le **String Template** :

```kotlin
// Kotlin

val name = "John"
val age = 24

println("Je m'appelle $name")               // Output: Je m'appelle John
println("Dans 10 ans j'aurai ${age + 10}")  // Output: Dans 10 ans j'aurai 34
```

Java a tenté quelque chose de similaire, en preview dans **Java 21** (JEP 430) puis **Java 22** (JEP 459) :

```java
// Java 21 / 22, en preview uniquement

String name = "Jean";
String message = STR."Je m'appelle \{name}";
// message vaut : Je m'appelle Jean
```

**Mais après les retours des utilisateurs, la fonctionnalité a été retirée de Java 23**, et elle n'est toujours pas revenue. Elle n'est pas abandonnée pour autant : elle doit être retravaillée. En attendant, côté Java, on en reste à la concaténation ou à `"Je m'appelle %s".formatted(name)`.

Sur la seule concision, Kotlin l'emporte donc largement. Mais soyons honnête sur ce que visait Java : pas la concision, justement, mais la **sûreté**, grâce aux *template processors* capables de valider ou d'échapper le contenu interpolé (injections SQL, HTML…). Ça, l'interpolation de Kotlin ne le fait pas — `"$user"` insère la valeur telle quelle.

---

## 3. La sûreté du null

Avec Kotlin, les `NullPointerException` sont considérablement réduites, pour une raison simple : **la nullabilité fait partie du système de types**. `String` et `String?` sont deux types différents.

```kotlin
// Kotlin

var nom: String = "John"
nom = null                        // erreur de compilation

var nomNullable: String? = null   // OK
```

Le compilateur vous force ensuite à traiter le cas nul : `?.` (*safe call*) n'appelle la méthode que si la valeur existe, `?:` (*elvis*) fournit une valeur par défaut, et `!!` force le déréférencement en levant une NPE **si la valeur est nulle** — à utiliser le moins possible.

```kotlin
// Kotlin

val longueur = nomNullable?.length ?: 0
nomNullable?.let { println(it.uppercase()) }
```

On peut aussi déclarer une propriété non nulle initialisée plus tard avec `lateinit var` — réservé aux `var`, d'un type non nul et **non primitif**. C'est pratique pour l'injection de dépendances ou le `setUp()` d'un test, à condition d'accepter une `UninitializedPropertyAccessException` si on y accède trop tôt (`::maPropriete.isInitialized` permet de vérifier). Pour un `val` calculé au premier accès, on préfère `by lazy`.

> **Kotlin ne supprime pas la NPE, il la rend visible.** Trois portes restent ouvertes : `!!`, `lateinit`, et surtout l'appel de code Java. Un type venant de Java est un *platform type* (`String!`) : le compilateur ne sait pas s'il peut être nul et vous laisse passer. Annoter le code Java (`@Nullable` / `@NonNull`, ou JSpecify) permet à Kotlin de récupérer l'information.

Bonne nouvelle malgré tout : quand ça casse, ça casse **à la frontière**. Kotlin insère un contrôle au moment où la valeur entre dans un type non nul, et l'exception est levée dès l'affectation :

```
Exception in thread "main" java.lang.NullPointerException: find(...) must not be null
```

Quand vous voyez `… must not be null`, vous savez que vous venez de trouver une frontière Java non annotée.

Dernier point : une propriété non nulle doit avoir reçu sa valeur à la fin de la construction — par un initialiseur, un bloc `init` ou un constructeur secondaire — sauf si elle est calculée par un getter personnalisé ou déléguée à `by lazy`. Une variable locale, elle, peut être affectée plus loin. Cela dit, on écrit rarement les choses comme ça, parce que **`if`, `when` et `try` sont des expressions** en Kotlin : `val message = if (estMajeur) "Bienvenue" else "Accès refusé"`. C'est d'ailleurs pour cette raison que Kotlin n'a pas d'opérateur ternaire — il n'en a pas besoin.

---

## 4. Fonctionnalités avancées

### A. Extension functions

Les **fonctions d'extension** permettent d'ajouter des fonctionnalités à des classes existantes sans les modifier ni en hériter. On les appelle ensuite comme si elles faisaient partie de la classe d'origine :

```kotlin
// Kotlin

fun String.removeWhitespace(): String = replace(Regex("\\s"), "")

fun main() {
    val texte = "Hello, world !"
    println(texte.removeWhitespace())
    // Output: Hello,world!
}
```

À l'intérieur de l'extension, `this` désigne la chaîne appelante — on peut l'omettre, comme ci-dessus avec `replace(...)`. Trois points à connaître :

- Elle est résolue **statiquement**, à la compilation, selon le type déclaré. Ce n'est pas une vraie méthode : pas de polymorphisme, pas d'override.
- Si une méthode membre a la même signature, **c'est toujours le membre qui gagne**.
- Elle n'accède pas aux membres `private` de la classe étendue : elle reste extérieure.

Concrètement, le compilateur en fait une méthode statique prenant le receveur en premier paramètre. Depuis Java, l'appel devient `MonFichierKt.removeWhitespace(texte)` — et comme ce nom vient du **nom du fichier**, renommer `MonFichier.kt` casse l'API Java, ce que `@JvmName` permet de figer.

Ce n'est pas un gadget : la bibliothèque standard de Kotlin est elle-même largement construite sur ce mécanisme — `map`, `filter`, `first`, `associateBy` sont des extensions.

On peut aussi définir une extension sur un **type nullable**, et donc l'appeler sans risque sur une valeur nulle. C'est ainsi qu'est écrite `isNullOrEmpty()` dans la stdlib :

```kotlin
// Kotlin

fun String?.estVide(): Boolean = this == null || this.isEmpty()

val nom: String? = null
println(nom.estVide())   // true — pas de ?. nécessaire
```

### B. Suspend functions

Les fonctions `suspend` sont utilisées dans la programmation asynchrone avec les **coroutines**. Elles permettent de suspendre l'exécution **sans bloquer le thread** : une fonction `suspend` peut appeler d'autres fonctions `suspend`, être mise en pause, puis reprise plus tard, éventuellement sur un autre thread.

```kotlin
// Kotlin

import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

suspend fun fetchData(): String {
    delay(1000)   // suspend la coroutine, ne bloque pas le thread
    return "Données récupérées"
}

fun main() = runBlocking {
    println("Début")
    println(fetchData())
    println("Fin")
}
```

> **Les coroutines, en deux mots** — elles permettent d'écrire du code asynchrone de manière séquentielle, sans gérer de callbacks ni de threads. Contrairement au mot-clé `suspend` qui fait partie du langage, elles viennent d'une bibliothèque à ajouter au projet : `org.jetbrains.kotlinx:kotlinx-coroutines-core`.

Cet exemple reste séquentiel et ne montre donc pas encore l'intérêt réel de la chose. Le voici, avec deux appels lancés en parallèle :

```kotlin
// Kotlin

import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking

suspend fun fetchNom(): String { delay(1000); return "John" }
suspend fun fetchAge(): Int { delay(1000); return 24 }

fun main() = runBlocking {
    val debut = System.currentTimeMillis()

    coroutineScope {
        val nom = async { fetchNom() }
        val age = async { fetchAge() }
        println("${nom.await()} / ${age.await()} en ${System.currentTimeMillis() - debut} ms")
    }
}
// Output: John / 24 en 1013 ms  — le chiffre varie, mais reste ~1 s
```

Deux appels d'une seconde chacun, exécutés en un peu plus d'une seconde au total, sur un seul thread : `async` lance le travail en parallèle, `await()` en récupère le résultat. Et si l'un des deux échoue, `coroutineScope` annule l'autre et propage l'erreur — pas de tâche orpheline. C'est ça, la *structured concurrency*.

L'autre gain, moins visible sur un exemple à deux appels, c'est la densité : mille coroutines en attente ne mobilisent pas mille threads, puisque le thread est rendu au pool pendant l'attente.

Un mot sur `runBlocking` : il fait le pont entre le monde bloquant et celui des coroutines, et **bloque** le thread appelant. Il est fait pour un `main()` ou un test, pas pour du code applicatif.

Vous avez peut-être remarqué que je déclare `main()` et `removeWhitespace()` avec un `=` au lieu des accolades. Ce n'est pas une erreur : Kotlin permet d'écrire des **fonctions à expression unique**, dont le corps se résume à une seule expression, dont la valeur est retournée.

### C. Le parallèle avec les virtual threads de Java

Depuis **Java 21**, les *virtual threads* ont été introduits (JEP 444). Je ne vais pas m'attarder dessus, car je n'ai pas encore eu l'occasion de les utiliser en situation réelle comme les coroutines. Mais le parallèle est intéressant, puisque les deux visent le même problème : gérer beaucoup de tâches concurrentes sans épuiser les threads système.

Contrairement aux coroutines, **les virtual threads restent du code synchrone** : on écrit du code bloquant classique, sans mot-clé `suspend` à propager dans toute la codebase. Ce sont les threads qui sont mieux gérés par la JVM — un virtual thread est ordonnancé sur un petit pool de threads porteurs, et lorsqu'il bloque sur une I/O, il est mis de côté sans immobiliser le thread système, d'où un coût bien inférieur à celui des threads traditionnels. Un détail si vous êtes encore sur Java 21 : jusqu'à Java 23, un virtual thread bloqué dans un bloc `synchronized` *épinglait* son thread porteur, ce qui annulait une partie du bénéfice. C'est corrigé depuis **Java 24** (JEP 491).

Les coroutines gardent quelques atouts : l'annulation coopérative, les `Flow`, et la disponibilité sur toutes les cibles Kotlin (Android, iOS, JS, natif) et pas seulement sur la JVM. La structured concurrency, elle, n'est plus un avantage exclusif : Java a la sienne avec `StructuredTaskScope`, encore en preview à ce jour.

---

## 5. Interopérabilité

Kotlin est pleinement compatible avec Java : vous pouvez utiliser des bibliothèques Java dans du code Kotlin sans aucune modification, et inversement. Les deux langages cohabitent dans le même module.

C'est ce qui rend la migration progressive possible, et c'est de loin ce que je préfère : on convertit un fichier, on le compile, on le teste, et on ne touche à rien d'autre. Appeler une classe Java depuis Kotlin ne demande strictement rien de particulier.

Le sens inverse, Kotlin appelé depuis Java, demande un peu plus d'attention. Le cas qui surprend le plus est le `companion object` : sans annotation, ce qui ressemble à une méthode statique ne l'est pas.

```kotlin
// Config.kt

class Config {
    companion object {
        fun sansAnnotation() = "sans"
        @JvmStatic fun avecAnnotation() = "avec"
    }
}
```

```java
// Java

Config.Companion.sansAnnotation();   // obligatoire sans @JvmStatic
Config.avecAnnotation();             // ce qu'on attendait
```

Dans le même registre : les fonctions de premier niveau d'un fichier `Utils.kt` atterrissent dans une classe `UtilsKt` ; `@JvmOverloads` génère les surcharges correspondant aux paramètres par défaut, que Java ne connaît pas ; `@JvmField` expose une propriété comme un vrai champ ; `@Throws` redéclare les exceptions vérifiées, absentes de Kotlin ; `Unit` devient `void` ; et les tableaux distinguent `Array<String>` (qui devient bien `String[]`) des types spécialisés `IntArray` / `ByteArray`.

Rien de bloquant, donc, mais « pleinement compatible » demande quand même de connaître ces conventions le jour où votre code Kotlin est destiné à être consommé depuis Java.

---

## 6. Ce qui m'a demandé un temps d'adaptation

Comme promis, parlons de ce qui a coincé. Au début, j'ai eu du mal avec la syntaxe, et surtout avec la quantité de nouveaux mots-clés et de fonctions bien pratiques qu'il faut d'abord apprendre à distinguer : `when`, `let`, `apply`, `run`, `also`, `with`, `takeIf`… Prises une par une, elles sont simples. Le problème, c'est qu'elles se ressemblent, et que savoir *laquelle* utiliser, et surtout *pourquoi* celle-là plutôt qu'une autre, ne vient pas en une semaine. Pendant un moment, j'ai écrit du Java avec une syntaxe Kotlin, ce qui est la façon la plus sûre de ne profiter d'aucun des deux.

Ce qui m'a aidé, c'est de ne pas tout adopter d'un coup : d'abord `val` partout, la nullabilité et les data classes, puis les extensions, et les fonctions de portée seulement quand j'ai commencé à voir *où* elles rendaient le code plus lisible.

Il reste d'ailleurs beaucoup de choses que je n'ai pas abordées ici alors que je les utilise tous les jours : le `when` (un `switch` sous stéroïdes), les *smart casts*, les *sealed classes*, les collections et lambdas de la stdlib, la délégation (`by`), et bien sûr Kotlin Multiplatform. De quoi remplir un deuxième article.

---

## 7. Conclusion

Passer de Java à Kotlin a transformé ma façon de coder : un code plus concis, plus sûr sur la nullabilité, et moins de boilerplate grâce aux data classes, aux extensions et aux coroutines. Cela ne veut pas dire que Java stagne — les records, `var`, le pattern matching et les virtual threads le montrent bien — mais l'ensemble que propose Kotlin me paraît aujourd'hui plus cohérent.

Si vous voulez essayer, le meilleur moyen de commencer, c'est justement l'interopérabilité : un fichier, puis un autre.
