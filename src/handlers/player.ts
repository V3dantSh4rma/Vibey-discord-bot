import { createAudioPlayer, NoSubscriberBehavior } from "@discordjs/voice";

const audioPlayer = createAudioPlayer({
	behaviors : {
		noSubscriber : NoSubscriberBehavior.Play
	}
});

export {
	audioPlayer
};
