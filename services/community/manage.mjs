import {openStore} from './server.mjs';
const [slug,status,phase]=process.argv.slice(2);
if(!slug||!['open','planned','in-progress','shipped','closed'].includes(status)||!['now','next','later','none'].includes(phase)){console.error('Usage: node services/community/manage.mjs <slug> <open|planned|in-progress|shipped|closed> <now|next|later|none>');process.exit(1)}
const db=openStore(process.env.COMMUNITY_DB||'data/community.sqlite');const result=db.prepare('UPDATE ideas SET status=?,phase=? WHERE slug=?').run(status,phase==='none'?null:phase,slug);db.close();if(result.changes!==1){console.error('Idea not found');process.exit(1)}console.log('Proposal updated.');
