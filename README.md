# AegisCare research website

Final year research project site for **AegisCare: Intelligent Fall Monitoring System for Elderly Care** (Group R26_IT_051, SLIIT).
Plain HTML + CSS with a small JavaScript file for the light/dark toggle and animations. No build step, no frameworks.

## 1. Where to put your files

Copy each file into the matching folder under `downloads/`. Keep the names exactly as shown (GitHub Pages is case sensitive).

| Folder | Files |
|---|---|
| `downloads/stage-1-proposal/` | Proposal Presentation.pptx, Proposal Report-Member 1.pdf, Proposal Report-Member 2.pdf, Proposal Report-Member 3.pdf, Proposal Report-Member 4.pdf |
| `downloads/stage-2-progress-1/` | Progress-1-Presentation.pptx |
| `downloads/stage-3-progress-2/` | Progress-2-Presentation.pptx |
| `downloads/stage-4-final/` | Final Presentation.pptx, Final Report Member1.pdf, Final Report Member2.pdf, Final Report Member3.pdf, Final Report Member4.pdf, Research Paper.pdf |

The Research archive page shows **"File not uploaded yet"** on any file that is missing, and shows the file size once it is there.

## 2. Publish on GitHub Pages (free)

1. Create a GitHub account and click **New repository**. Name it e.g. `aegiscare` and set it to **Public**.
2. Click **uploading an existing file**, then drag in **everything inside this folder** (`index.html`, `assets`, `downloads`, ...). Do not upload the folder itself, upload its contents. Also drag the `.nojekyll` file if your computer shows hidden files; it is optional.
3. Click **Commit changes**.
4. Go to **Settings > Pages**. Under *Build and deployment*, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, then **Save**.
5. Wait 1 to 2 minutes. Your site is at `https://YOUR-USERNAME.github.io/aegiscare/`.
6. To add or replace files later: open the folder in the repository, click **Add file > Upload files**, commit. The site updates in about a minute.

Tip: if a single file is larger than 25 MB, the browser upload on GitHub will refuse it. Use GitHub Desktop or compress the file.

## 3. About the 20 MB limit

The site itself (pages, images, fonts) is about 2 MB. If your course server also enforces a 20 MB total, keep the documents under roughly 17 MB combined (compress large PowerPoint images). GitHub Pages itself does not have this limit.

## 4. Editing the site

* Colours: the top of `assets/css/style.css`. The dark background `--bg: #0F0E1E` is your navy; the light theme is the block below it.
* Text: open any `.html` file in a text editor and edit the words between the tags.
* Team details: `team.html`. Photos: `assets/img/member-1.jpg` ... `member-4.jpg`.
* Add a new document: copy one `<article class="file ...">...</article>` block in `resources.html`, change the file name and title, and add the file to the matching `downloads/` folder.
* Theme: the visitor's light/dark choice is remembered in their browser.

## 5. File map

```
index.html                              Home
about.html                              About our research
team.html                               Team and contacts
features.html                           Features overview (4 components)
feature-activity-recognition.html       Component 1
feature-environmental-risk.html         Component 2
feature-ppg-fall-risk.html              Component 3
feature-alert-classification.html       Component 4
architecture.html                       Full system architecture
resources.html                          Research archive (all downloads)
assets/ (css, js, img, fonts)           Styles, scripts, photos, diagrams
downloads/                              YOUR FILES GO HERE
```
