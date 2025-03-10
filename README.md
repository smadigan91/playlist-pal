# Spotify Playlist Pal

Playlist Pal is an app that adds a social layer over Spotify's collaborative playlists to improve and enrich the
experience of collaborating with others to create the ultimate musical collections. Create a playlist, create some rules
about which music can be added to the playlist, choose your collaborators, and create the playlist of your dreams.

# How to run locally

### Running with docker-compose
Below are instructions on how to run the app locally with docker-compose

You'll need the following tools:
- [Docker & Compose](https://docs.docker.com/compose/install/)
- [ansible-vault](https://docs.ansible.com/ansible/latest/vault_guide/vault_encrypting_content.html) or the wrapper for Powershell if you're on Windows (instructions on that [here](https://www.bloggingforlogging.com/2018/05/20/decrypting-the-secrets-of-ansible-vault-in-powershell/), note the commands at the bottom).

Then, to actually run the app:
1. You will need to decrypt `secrets/secrets.yml.enc` into `secrets/secrets.yml.dec`, **_which should be ignored by git_**.
    - First, ask [@smadigan91](https://github.com/smadigan91) for the decryption key. Please don't share with anyone or accidentally commit this to Github.
    - Next using ansible-vault or the windows wrapper, decrypt the secrets: 
        - The command to decrypt the file for ansible-vault will look something like `ansible-vault decrypt secrets/secrets.yml.enc --output=secrets/secrets.yml.dec`, after which you will be promprted for the decryption key.
        - For the windows wrapper, it'll look something like `Get-DecryptedAnsibleVault -Path .\secrets\secrets.yml.enc | Set-Content -Path .\secrets\secrets.yml.dec`
        - If you're adding new secrets, you can modify secrets.yml.dec and re-encrypt it to secrets.yml.enc **_using the same encryption key_**.
2. In root directory, run `docker-compose up`. The app should be accessible at http://localhost:5173
