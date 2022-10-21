<h1 align="center"> Vibey </h1>
<h3 align="center"> A Multipurpous discord bot. Ranging from Music to Moderation. </h3>
<h4 align="center"> Fully coded by me(bot and the website) with a little bit of help from others.</h4>

[![wakatime](https://wakatime.com/badge/github/V3dantSh4rma/Octal-v2.svg)](https://wakatime.com/badge/github/V3dantSh4rma/Octal-v2)

# P.S
Not really working on this bot for a short amount of time. So feel free to contribute, the commands are inside the [commands folder](./src/commands/).

# Contributions and Issues:
Please make a Pull request adding the command which you fixed or have added, mention me. The PR will take some time to get it merged. Create issues if you find some error in the command. The **Command** where you faced the error is a must and the error which you have faced. 

# Changes to be done:
- FFMPEG on Windows seems fucked up. Music used to be working all smooth and it lags and stutters. Either have to find _another way_ to get the music work smoothly or just have to stick with the current if failed to do so. 
- Queue handler for the music commands. (Coded the logic, implementation is to be done)
- Lacks NSFW commands other than the [only nsfw command](./src/commands/api/secret.ts).
- Convert the [raw css](./src/static/stylings/styling.css) into Tailwindcss to make life more easier.

# Installation
First of all, Rename the ``.env.example`` to ``.env``. Fill in your bot Token and application id and fill in all of the values/api keys.
Make sure you have git, nodejs & npm installed. Open the terminal and type these commands:
```
- git clone https://github.com/V3dantSh4rma/Vibey-discord-bot.git
- npm install
- npx tsc
- node .
```
