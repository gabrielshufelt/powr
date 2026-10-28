# Source-File AI Declaration
# AI contribution: 50% or more AI-generated

"""
Open the staging app and the hosts' dashboards in the default browser.

Works on Windows, macOS and Linux. The URLs match docs/deployment.md; update both together.
Run it from anywhere:

    python scripts/open_staging.py
"""

import webbrowser

STAGING_URLS = [
    "https://powr-rho.vercel.app",  # frontend
    "https://powr-backend-staging.onrender.com/health",  # backend health and deployed commit
    "https://console.neon.tech",  # database
]


def main() -> None:
    for url in STAGING_URLS:
        print(f"Opening {url}")
        webbrowser.open_new_tab(url)


if __name__ == "__main__":
    main()
