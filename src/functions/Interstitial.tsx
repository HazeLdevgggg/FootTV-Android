import { useInterstitial } from "../hooks/Pub";
import Log from "./Log";

let number = 0;
export default function Interstitial(){
    let pub = true;
    let FirstPubAfter = 3;
    let PubAfter = 10;
    const { showInterstitial } = useInterstitial();
    if(pub){
        if(number===FirstPubAfter){
            showInterstitial();
        }else if(number%PubAfter===0){
            showInterstitial();
        }else{
            Log("No need to show a pub, indexpub :"+number)
        }
    }
    number++;
}