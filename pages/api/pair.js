// pages/api/pair.js
import { makeid } from '../../gen-id.js';
import { upload } from '../../mega.js';
import fs from 'fs';
import pino from 'pino';
import { makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } from '@whiskeysockets/baileys';

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const id = makeid();
    let num = req.query.number;
    
    if (!num) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    async function RONY_SKIES_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            const items = ["Safari"];
            function selectRandomItem(array) {
                const randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            const randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });
            
            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num);
                if (!res.headersSent) {
                    return res.json({ code });
                }
            }
            
            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection == "open") {
                    await delay(5000);
                    const rf = `./temp/${id}/creds.json`;
                    
                    try {
                        // Upload to folder structure
                        const userFolder = sock.user.id.split('@')[0];
                        const mega_url = await upload(fs.createReadStream(rf), `${userFolder}/creds.json`);
                        
                        // Session ID is the folder name (phone number)
                        const session_id = userFolder;
                        const session_message = "rony_skies~" + session_id;
                        
                        // Send session ID to user
                        const code = await sock.sendMessage(sock.user.id, { text: session_message });
                        
                        const desc = `*Hey there, RONY SKIES User!* 👋🏻

Thanks for using *RONY SKIES* — your session has been successfully created!

🔐 *Session ID:* ${session_id}
⚠️ *Keep it safe!* Do NOT share this ID with anyone.

——————

*🤖 How to use:*
Set this in your environment variables:
SESSION_ID=${session_id}

*📢 Support Channel:*https://whatsapp.com/channel/0029VbBnRol1XquTPCwUsk15

*📧 Support Email:*
incoming+ynwghosted-savy-x-pair-code-76096175-issue-@incoming.gitlab.com

——————

> *© Powered by RONY SKIES*
Stay secure and enjoy! ✌🏻`;

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "rony-skies-bot",
                                    thumbnailUrl: "https://files.catbox.moe/6ghj55.jpg",
                                    sourceUrl: "https://chat.whatsapp.com/BL0erai5W6O1dKGMczM7vG?mode=hqrc",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        }, { quoted: code });

                    } catch (e) {
                        const ddd = await sock.sendMessage(sock.user.id, { text: "Error: " + e.message });
                        const desc = `*Hey there!* 👋🏻

There was an error uploading your session, but it's still saved locally.

Please contact support for assistance.

*📢 Support Channel:*https://whatsapp.com/channel/0029VbBnRol1XquTPCwUsk15

*📧 Support Email:*
incoming+ynwghosted-rony-x-pair-code-76096175-issue-@incoming.gitlab.com

——————

> *© Powered by RONY SKIES*`;
                        
                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "rony-skies-bot",
                                    thumbnailUrl: "https://files.catbox.moe/6ghj55.jpg",
                                    sourceUrl: "https://chat.whatsapp.com/BL0erai5W6O1dKGMczM7vG?mode=hqrc",
                                    mediaType: 2,
                                    renderLargerThumbnail: true,
                                    showAdAttribution: true
                                }  
                            }
                        }, { quoted: ddd });
                    }
                    
                    await delay(10);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    console.log(`👤 ${sock.user.id} Connected ✅ Session ID: ${userFolder}`);
                    await delay(10);
                    
                    if (!res.headersSent) {
                        res.json({ success: true, session_id: userFolder });
                    }
                    process.exit();
                    
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10);
                    RONY_SKIES_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("service restarted", err);
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                res.status(503).json({ error: "Service Unavailable" });
            }
        }
    }
   
    await RONY_SKIES_PAIR_CODE();
              }
