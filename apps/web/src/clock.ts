import {useSyncExternalStore} from 'react';
class Clock {
  frame=180; playing=false; duration=1320; listeners=new Set<()=>void>(); timer=0; origin=0;
  subscribe=(fn:()=>void)=>{this.listeners.add(fn);return()=>{this.listeners.delete(fn);};};
  snapshot=()=>this.frame;
  playingSnapshot=()=>this.playing;
  emit(){this.listeners.forEach(fn=>fn());}
  seek(frame:number){this.frame=Math.min(Math.max(0,Math.round(frame)),Math.max(0,this.duration-1));this.origin=performance.now()-this.frame/30*1000;this.emit();}
  setDuration(frames:number){this.duration=frames;if(this.frame>=frames)this.seek(frames-1);}
  tick=()=>{if(!this.playing)return;const next=Math.floor((performance.now()-this.origin)/1000*30);if(next>=this.duration){this.frame=this.duration-1;this.pause();return;}if(next!==this.frame){this.frame=next;this.emit();}this.timer=requestAnimationFrame(this.tick);};
  play(){if(this.playing)return;if(this.frame>=this.duration-1)this.seek(0);this.playing=true;this.origin=performance.now()-this.frame/30*1000;this.emit();this.timer=requestAnimationFrame(this.tick);}
  pause(){this.playing=false;cancelAnimationFrame(this.timer);this.emit();}
  toggle(){this.playing?this.pause():this.play();}
}
export const clock=new Clock();
export function useFrame(){return useSyncExternalStore(clock.subscribe,clock.snapshot);}
export function usePlaying(){return useSyncExternalStore(clock.subscribe,clock.playingSnapshot);}
