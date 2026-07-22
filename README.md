<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:3F0282,50:3A06BA,100:7164F5&height=200&section=header&text=George%20Vogas&fontSize=60&fontColor=ffffff&fontAlignY=35&desc=CS%20Student%20%40%20Vanier%20College&descAlignY=55&descSize=20&animation=fadeIn" width="100%" />

  [![Portfolio](https://img.shields.io/badge/Portfolio-gvogas.github.io-3A06BA?style=for-the-badge&logo=googlechrome&logoColor=white)](https://gvogas.github.io/)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/george-vogas-b13944338/)
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gvogas)
  [![Devpost](https://img.shields.io/badge/Devpost-003E54?style=for-the-badge&logo=devpost&logoColor=white)](https://devpost.com/Terminator320)
  [![Profile Views](https://komarev.com/ghpvc/?username=gvogas&style=for-the-badge&color=0F19FC&label=PROFILE+VIEWS)](https://github.com/gvogas)

  Portfolio site: **[gvogas.github.io](https://gvogas.github.io/)**, with an interactive 3D visualization of my repositories
</div>

---

## About Me

I'm a CS student at Vanier College in Montréal. I've learned primarily by building: a scheduling app a client uses every day, a ticketing site my team deployed, a desktop POS system, and a Unity game I contribute to. Outside of coursework, my main interests are robotics and hockey analytics.

---

## GitHub Stats

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gvogas/gvogas/stats/github-stats-dark.svg" />
    <img height="170" alt="George's GitHub stats" src="https://raw.githubusercontent.com/gvogas/gvogas/stats/github-stats-light.svg" />
  </picture>
  &nbsp;&nbsp;
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://streak-stats.demolab.com?user=gvogas&hide_border=true&background=1a0535&ring=7164F5&fire=0F19FC&currStreakLabel=54D5FF&sideLabels=7164F5&dates=9a9cc0&currStreakNum=ffffff&sideNums=ffffff&stroke=3A06BA" />
    <img height="170" alt="GitHub streak stats" src="https://streak-stats.demolab.com?user=gvogas&background=ffffff&ring=0F19FC&fire=3A06BA&currStreakLabel=3A06BA&sideLabels=3A06BA&dates=6b6f93&currStreakNum=1a1c3d&sideNums=1a1c3d&stroke=e2e5f6&border=e2e5f6" />
  </picture>
  <br/><br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gvogas/gvogas/stats/top-langs-dark.svg" />
    <img alt="Most used languages" src="https://raw.githubusercontent.com/gvogas/gvogas/stats/top-langs-light.svg" />
  </picture>
  <br/><br/>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/gvogas/gvogas/output/github-snake-dark.svg" />
    <img alt="Contribution snake animation" src="https://raw.githubusercontent.com/gvogas/gvogas/output/github-snake.svg" />
  </picture>
</div>

---

## Projects

### Scheduling App &nbsp;·&nbsp; [View Repo →](https://github.com/gvogas/Scheduling-App)

> **Flutter · Firebase · Google Places API · Dart** &nbsp;·&nbsp; *Client-commissioned · Production · Android*

<details>
<summary>What it does</summary>

Built for a service company that was doing all of its scheduling on paper. It's been in daily use since I delivered it.

- Real-time appointment calendar with per-employee color coding and admin/employee role separation
- Full client directory with accent-insensitive search across large record sets
- In-app photo capture, auto-compression, and background upload to Firebase Storage
- Invite-only employee onboarding: admin creates the account first, and only pre-whitelisted emails can register
- Light/dark mode, text scaling, and multi-language support, all persisted across sessions
- Google Places API for address autocomplete on client records

**Architecture:** Feature-first folder structure; all DB access mediated through per-feature service classes, so screens never query Firestore directly. Single centralized route handler.

**Up next:** Wave billing integration: completed appointments auto-generate invoices, sync client records, and surface payment status in-app.

</details>

---

### TicketMaestrix &nbsp;·&nbsp; [View Website →](https://ticketmaestrix.shop/) &nbsp;·&nbsp; [View Repo →](https://github.com/gvogas/Ticketmaestrix)

> **PHP · Twig · Slim MVC · MySQL · GitHub Actions · cPanel** &nbsp;·&nbsp; *Team Project · Deployed*

<details>
<summary>What it does</summary>

Event ticketing site built with two classmates. Users buy tickets for concerts, raffles, and movies; admins manage events, inventory, and sales.

- User accounts with event browsing, ticket purchase, and order history
- Admin dashboard for event creation, ticket inventory control, and transaction monitoring
- Built on a custom Slim MVC framework with Twig templating, no off-the-shelf CMS
- Internationalization support via `/translations` directory
- CI/CD pipeline via GitHub Actions deploying to cPanel on push

**Team:** George Vogas · Fadwa Shalby · Lucas Coveyduck

</details>

---

### AI Study Assistant &nbsp;·&nbsp; [View Repo →](https://github.com/gvogas/AI-Study-Assistant) &nbsp;·&nbsp; [Devpost →](https://devpost.com/software/ai-study-assistant-giursf)

> **Python · FastAPI · Groq (LLaMA 3.3) · Tavily · SQLite · Vanilla JS** &nbsp;·&nbsp; *Hackathon · MariHacks · Team*

<details>
<summary>What it does</summary>

Hackathon project from MariHacks. Give it a topic, plus optionally your notes, PDFs, or slides, and it generates study material, with a coin economy, a quiz-linked plant companion, and optional Spotify playback layered on top.

- AI research agent (Tavily) + content agent (Groq/LLaMA 3.3) generate structured notes, 1–30 flashcards, and 1–20 multiple-choice quiz questions at beginner / intermediate / advanced difficulty
- Personalized 1–30 day study plan with priority tagging and extra time automatically allocated to weak areas from your latest quiz
- Supports uploaded `.pdf`, `.pptx`, `.txt`, and `.md` files as study sources alongside web research
- Coin economy with four upgrade tracks, a growable plant pet that heals on correct answers and takes damage on wrong ones, and seven unlockable tier skins
- Optional Spotify Connect integration: OAuth, device selection, playlist/track search, and full playback controls
- JWT auth, configurable SlowAPI rate limiting, Fernet-encrypted Spotify tokens, and pytest async coverage across auth, quiz, shop, and Spotify flows

**Architecture:** Feature-first FastAPI routers (`auth`, `study`, `quiz`, `plan`, `shop`, `profile`, `plant`, `spotify`), dedicated agent layer for AI/search, service layer for all business logic. No framework on the frontend, zero build step.

**Team:** George Vogas · 3 collaborators

</details>

---

### Point-of-Sales Patterns &nbsp;·&nbsp; [View Repo →](https://github.com/gvogas/Point-of-Sales_Patterns)

> **Java · JavaFX · MySQL · Maven · JDK 24** &nbsp;·&nbsp; *Final Project · Programming Patterns Course*

<details>
<summary>What it does</summary>

Final project for my programming patterns course: a JavaFX point-of-sale system built around the design patterns covered in class.

- Multi-screen JavaFX GUI: main menu, order flow, inventory management, sales analytics, and payment
- **Factory Method** pattern for payment processing: Cash, Debit, and Credit each implemented as concrete factories
- **Multithreaded profit calculator** that splits the sales list across two threads with semaphore synchronization for safe aggregation
- MySQL-backed inventory, menu items, ingredients, and sales orders with a full SQL schema included
- MVC-inspired structure with centralized logging to file

**Stack note:** MySQL JDBC connector bundled; database schema + seed data included as `pos.sql` for instant setup.

</details>

---

### The Rogue Market &nbsp;·&nbsp; [View Repo →](https://github.com/gvogas/Star-wars-Interactive-Web-Application)

> **JavaScript · HTML · CSS · JSON · XML** &nbsp;·&nbsp; *Final Project · Internet Programming Course*

<details>
<summary>What it does</summary>

Star Wars–themed store for my internet programming final. Twelve pages, vanilla JS, no backend.

- Live product search with suggestion dropdown and highlighted infinite-scroll results
- Shopping cart with per-item quantity control, subtotal, and localStorage persistence
- Full checkout flow: tax calculation, payment method validation, order confirmation
- Cookie-based user profile system with editable avatar
- Dynamic product rendering from category JSONs; XML-powered navigation via AJAX
- Modular JS: `AuthModel`, `CartManagement`, `ProductModel`, `SearchModel`, `FormValidation`, injected `Header`/`Footer`
- Starfield backgrounds, neon hover effects, `Orbitron` / `Pathway Gothic One` fonts

</details>

---

### Last Signal &nbsp;·&nbsp; [View Repo →](https://github.com/alexder204/LastSignal) *(Contributor)*

> **Unity · C# · ShaderLab · HLSL**

<details>
<summary>What it does</summary>

A Unity game I contribute to, mostly gameplay code and custom shaders (the repo is about half ShaderLab/HLSL).

</details>

---

## Tech Stack

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)
![Dart](https://img.shields.io/badge/Dart-0175C2?style=for-the-badge&logo=dart&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![JavaFX](https://img.shields.io/badge/JavaFX-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Unity](https://img.shields.io/badge/Unity-000000?style=for-the-badge&logo=unity&logoColor=white)
![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)
![Apache](https://img.shields.io/badge/Apache-D22128?style=for-the-badge&logo=apache&logoColor=white)

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)

---

## Areas of Study

| Domain | Skills |
|---|---|
| **Software Development** | OOP, Design Patterns (Factory, MVC, Observer), multithreading & synchronization |
| **Mobile Development** | Flutter / Dart, Firebase (Auth, Firestore, Storage, App Check), offline-first architecture |
| **Web Development** | Full-stack PHP/MySQL, REST APIs, modular JavaScript, Twig templating, responsive CSS |
| **Database Design** | Schema design, normalization, stored procedures, MySQL / MariaDB / Firestore |
| **Systems** | Linux/Unix scripting, Apache, cPanel deployment, CI/CD with GitHub Actions |
| **Game Development** | Unity, C# game logic, ShaderLab / HLSL custom shaders |

---

Open to internships and collaboration. LinkedIn is the fastest way to reach me.

[![LinkedIn](https://img.shields.io/badge/Let's%20Connect-LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/george-vogas-b13944338/)
[![Devpost](https://img.shields.io/badge/My%20Projects-Devpost-003E54?style=for-the-badge&logo=devpost&logoColor=white)](https://devpost.com/Terminator320)

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:7164F5,50:3A06BA,100:3F0282&height=120&section=footer" width="100%" />
