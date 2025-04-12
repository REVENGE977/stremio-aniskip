<p align="center">
	<a href="https://github.com/aniskip">
		<img src="https://avatars.githubusercontent.com/u/154282335?s=200&v=4" alt="AniSkip">
	</a>
	<h1 align="center">Stremio AniSkip</h1>
	<p align="center">
		<img alt="GitHub Downloads (all assets, all releases)" src="https://img.shields.io/github/downloads/REVENGE977/stremio-aniskip/total?style=for-the-badge&color=%237B5BF5">
		<a href="https://github.com/REVENGE977/stremio-aniskip/stargazers">
			<img src="https://img.shields.io/github/stars/REVENGE977/stremio-aniskip.svg?style=for-the-badge&color=%237B5BF5" alt="stargazers">
		</a>
		<a href="https://github.com/REVENGE977/stremio-aniskip/releases/latest">
			<img src="https://img.shields.io/github/v/release/REVENGE977/stremio-aniskip?label=Latest%20Release&style=for-the-badge&color=%237B5BF5" alt="Latest Version">
		</a>
		<br>
		<a href="https://www.typescriptlang.org/">
			<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
		</a>
		<a href="https://developer.mozilla.org/en-US/docs/Web/HTML">
			<img src="https://img.shields.io/badge/HTML-239120?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
		</a>
		<a href="https://developer.mozilla.org/en-US/docs/Web/CSS">
			<img src="https://img.shields.io/badge/CSS-2965F1?&style=for-the-badge&logo=css3&logoColor=white" alt="CSS">
		</a>
	</p>
</p>

## ❓ What is Stremio AniSkip?
This project is a plugin for [Stremio Enhanced](https://github.com/REVENGE977/stremio-enhanced). It integrates the [AniSkip API](https://api.aniskip.com/api-docs) into Stremio to automatically skip anime openings/endings. 

**This is an early version so you might encounter bugs.**

It will highlight the skip segments in yellow and when the timestamp for them is reached, it will prompt you to skip or dismiss. It will automatically skip in 5 seconds if no option is chosen by the user.

<img src="./images/aniskip-example.png" style="width: 60%;" />

Here you can submit new vote segments or submit new ones. You can access this menu by pressing the skip icon.
You can press "Now" to automatically enter the current timestamp.

<img src="./images/aniskip-popup.png" style="width: 30%;" />

<b>NOTE:</b> Currently, when you submit a new skip segment, you have to leave the stream you're watching and go back in to see the changes. This will change in an update coming later.


## 🛠 How does it work?

This plugin uses the [Jikan API](https://jikan.moe/) to find the MyAnimeList ID for the anime you're watching. It then uses that ID to fetch any available skip segments from the [AniSkip API](https://api.aniskip.com/api-docs), since AniSkip relies on MyAnimeList IDs.

### Why only Kitsu is supported (for now)

Currently, this plugin only works with **Kitsu** titles. That might change later, but for now it’s intentional. Here’s why:

Stremio’s regular IMDb-based metaitems usually bundle **all seasons of a show under a single title**. This causes problems when trying to match a specific season or arc to its correct MyAnimeList ID—especially for anime where each season has a unique name that doesn't clearly say "Season 2" or "Part 3" (e.g., Re:Zero, Monogatari, etc.).

Additionally, IMDb metaitems often **split episodes into seasons** even when MyAnimeList doesn't (e.g., One Piece episode 300 shows up as Season 11, Episode 74 on Stremio, but it's just Episode 300 on MAL).

These inconsistencies make it unreliable to fetch MyAnimeList to find the ID of the anime you're watching, which is why Kitsu is relied on. It categorizes anime exactly like MyAnimeList with the same episode listing and naming structure.

### TL;DR

**Just use the Kitsu addon.**  
[Install it from here](https://www.stremio-addons.com/anime-kitsu.html) and always select the **Kitsu metaitem** when watching anime.

<div style="display: flex; justify-content: space-between;">
  <div style="text-align: center; width: 48%;">
    <img src="./images/IMDB.png" style="width: 40%;" />
    <p style="font-size: 0.9em;">IMDb metaitem <b>(not supported)</b></p>
  </div>
  <div style="text-align: center; width: 48%;">
    <img src="./images/Kitsu.png" style="width: 40%;" />
    <p style="font-size: 0.9em;">Kitsu metaitem <b>(supported)</b></p>
  </div>
</div>


## 📥 Downloads
You can download the latest version from [releases](https://github.com/REVENGE977/stremio-aniskip/releases) 
or directly download from the [dist folder](https://github.com/REVENGE977/stremio-aniskip/blob/main/dist/AniSkip.plugin.js).


## 🚨 Important Notice
**This project is not affiliated in any way with Stremio or AniSkip.**