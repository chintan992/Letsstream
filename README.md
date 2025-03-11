# Let's Stream 🎬

[![Netlify Status](https://api.netlify.com/api/v1/badges/02cdf567-4bb7-4551-a21c-abc9609ba7d0/deploy-status)](https://app.netlify.com/sites/letsstream/deploys)  
> A feature-rich streaming platform for movies and series, powered by TMDB and a custom recommendation engine. Watch, discover, and enjoy!

---

## Table of Contents

*   [About](#about)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Deployment](#deployment)
    *   [Netlify](#netlify-deployment)
    *   [Heroku](#heroku-deployment)
    *   [Cloudflare Pages](#cloudflare-pages-deployment)
*   [Future Goals](#future-goals)
*   [Contributing](#contributing)
*   [License](#license)
*   [New Release](#new-release)


---

## About

The **Let's Stream Website** is designed for a seamless video streaming experience. It leverages:

*   **The Streaming API** for video playback (using iframe integration in the current version). 
*   **The TMDB API** for comprehensive movie and series metadata.
*   **A Python-based recommendation engine** to suggest content based on user viewing history.

The frontend is built with **React** and deployed on **Netlify**, **Cloudflare Pages**, and **Heroku**. Future plans include migrating backend logic to serverless functions (potentially on **Cloudflare Workers**) and exploring options for scaling the recommendation engine (Node.js or Python).

---

## Features

Here's a breakdown of the key features, categorized for better readability:

**Core Functionality:**

*   **🎥 Video Playback:** Stream movies and series using iframe integration (more robust solutions planned).
*   **🔍 Search & Discovery:**  Find content easily with a powerful search powered by the TMDB API.
*   **🔥 Trending & Popular Content:** Discover what's hot, based on TMDB's trending data.
*   **♾️ Infinite Scroll:**  Enjoy continuous content loading as you browse.
*   **📱 Responsive Design:**  Optimized for viewing on any device (desktop, tablet, mobile).
*   **✨ Dark Mode:** Switch between light and dark themes for optimal viewing comfort.

**User Experience:**

*   **👤 User Authentication:** Secure login and registration using Firebase Authentication.
*   **🎬 Personalized Profiles:** Create profiles, customize avatars, and add bios.
*   **📝 Watchlists:**  Save movies and series to watch later and receive notifications for new episode releases. *(Future Enhancement)*
*   **⭐ User Reviews and Ratings:** Rate and review content, and view aggregated ratings from TMDB and other users. *(Future Enhancement)*
*   **🤝 Social Sharing:** Share your favourite content on social media. *(Future Enhancement)*
*   **🔄 Interactive Carousel:** Browse featured content with a visually appealing carousel (using `react-slick`).

**Technical Features:**

*   **⚙️ PWA Support:**  Installable as a Progressive Web App for offline access and a native-like experience (powered by Workbox).
*   **⚠️ Error Handling:** Robust error boundaries for graceful error management and improved user experience.

---

## Tech Stack

This project utilizes a modern web development stack:

*   **Frontend:**
    *   React 18
    *   Tailwind CSS
    *   React Router v6
    *   React Slick
*   **Backend/Services:**
    *   Firebase Authentication
*   **Progressive Web App:**
    *   Workbox
*   **Utilities:**
    *   ESLint
*   **Deployment:**
    *   Netlify
    *   Cloudflare Pages
    *   Heroku
*   **APIs:**
    *   TMDB API
    *   Streaming API *(Specify which one)*
*   **Testing:**
    *   Jest
    *   React Testing Library
*   **Version Control:**
    *   Git
*   **CI/CD:**
    *   GitHub Actions
*   **Other:**
    *   Markdown
    *   Firebase Security Rules
    *   WAI-ARIA
    *   Lighthouse
    *   MIT License
    *   Contributing

---

## Installation

Get the project running locally with these steps:

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/chintan992/letsstream.git](https://github.com/chintan992/letsstream.git)
    cd lets-stream
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**

    Create a `.env` file in the root directory and add your API keys and configuration:

    ```
    REACT_APP_TMDB_API_KEY=YOUR-API-KEY
    REACT_APP_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)
    REACT_APP_TMDB_IMAGE_BASE_URL=[https://image.tmdb.org/t/p](https://image.tmdb.org/t/p)
    # Add other environment variables as needed (e.g., Firebase config)
    ```
    **Important:** Replace `YOUR-API-KEY` with your actual TMDB API key. You may also need to add your Firebase configuration variables here.

---

## Usage

*   **Development Mode:**

    ```bash
    npm start
    ```
    This will start the development server, and you can view the application at `http://localhost:3000`.

*   **Production Build:**

    ```bash
    npm run build
    ```
    This creates an optimized production build in the `build` directory.

---

## Deployment

This project can be deployed to multiple platforms:

### Netlify Deployment

1.  Create a new site on [Netlify](https://www.netlify.com/).
2.  Connect your GitHub repository.
3.  Set the build command to `npm run build`.
4.  Set the publish directory to `build/`.
5.  Add your environment variables in the Netlify site settings.
6.  Click "Deploy Site."

### Heroku Deployment

1.  Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).
2.  Create a Heroku app:

    ```bash
    heroku create lets-stream  # Or choose a different app name
    ```

3.  Set environment variables:

    ```bash
    heroku config:set REACT_APP_TMDB_API_KEY=YOUR-API-KEY
    heroku config:set REACT_APP_TMDB_BASE_URL=[https://api.themoviedb.org/3](https://api.themoviedb.org/3)
    heroku config:set REACT_APP_TMDB_IMAGE_BASE_URL=[https://image.tmdb.org/t/p](https://image.tmdb.org/t/p)
    # Add any other necessary environment variables
    ```

4.  Create a `Procfile` in the root of your project (if you don't have one already):

    ```
    web: serve -s build -l 8000
    ```
    **Important:** You'll need to install `serve` as a dependency: `npm install serve`.  And add a `heroku-postbuild` script to your `package.json`:

    ```json
    "scripts": {
      "start": "react-scripts start",
      "build": "react-scripts build",
      "heroku-postbuild": "npm run build"
    }
    ```

5.  Deploy to Heroku:

    ```bash
    git push heroku main
    ```

### Cloudflare Pages Deployment

1.  Log in to your [Cloudflare](https://www.cloudflare.com/) account and go to "Pages."
2.  Click "Create a Project."
3.  Connect your Git repository (GitHub or GitLab).
4.  Configure build settings:
    *   **Build command:** `npm run build`
    *   **Build output directory:** `build/`
5.  Add your environment variables in the Cloudflare Pages settings.
6.  Deploy! Cloudflare Pages will handle the build and deployment process automatically.

---

## New Release

```bash
git tag Release-v1.0.0
git push origin Release-v1.0.0
```

## Future Goals

This section outlines planned future enhancements:

- User Profiles: Improved profile management and customization.
- Social Media Integration: Enhanced sharing capabilities.
- Advanced Search: More granular filtering options.
- User Reviews & Ratings: Full implementation of user feedback features.
- Multilingual Support: Localization for a global audience.
- Mobile App: Dedicated native mobile applications (iOS and Android).
- Live Streaming: Support for live events.
- Subscription Model: Options for premium content access.

## Contributing
> We welcome contributions! Please see our CONTRIBUTING.md file for detailed guidelines on how to contribute to this project.  This should include information on:

- Reporting bugs.
- Suggesting features.
- Submitting pull requests (including code style guidelines).

## License
This project is licensed under the MIT License - see the LICENSE file for details.
