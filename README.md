# iPlayarr

iPlayarr is a companion for Sonarr (and the rest of the *arr stack) to simplify integrating get_iplayer for episode search and download.

## Getting Started

### Download/Installation

The simplest way to use iPlayarr is to use the bundled docker definition:

```
docker built -t iplayarr .
docker run -d --name iplayarr -v /path/to/incomplete:/incomplete -v /path/to/complete:/complete --env-file=env-file -p 4404:4404 iplayarr
```

This will require the following properties in the env file:

| Property     | Description                                  |
| ------------ | -------------------------------------------- |
| API_KEY      | Api key to secure your iplayarr instance     |
| DOWNLOAD_DIR | Download directory for in progress pulls     |
| COMPLETE_DIR | Directory to move completed files to         |

### Usage

iplayarr presents as a newznab indexer and sabnzbd downloader on port 4044. In Sonarr you need to create a new SABnzbd download client with these settings:

*Name:* iPlayarr
*Host:* <Your Docker Host>
*Port:* 4044 (Unless remapped)
*API Key:* API_KEY from above
*Category:* iplayer

Test and save this. Then create a new Newznab indexer with these settings:

*Name:* iPlayarr
*URL:* http://<Your Docker Host>:4044
*Api Key:* API_KEY from above

Click on Advanced settings and set

*Download Client:* iPlayarr (created above)