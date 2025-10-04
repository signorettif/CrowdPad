import { Auth } from './Auth';
import { Gamepad } from './Gamepad';

interface ControlsProps {
    onAuthenticate: (secretKey: string) => void;
    authStatus: {
        message: string;
        className: string;
    };
    username: string;
    setUsername: (username: string) => void;
    onGameInput: (input: string) => void;
    gameControlsDisabled: boolean;
}

export const Controls = (props: ControlsProps) => {
    return (
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
            <Auth 
                onAuthenticate={props.onAuthenticate} 
                authStatus={props.authStatus} 
                username={props.username} 
                setUsername={props.setUsername} 
            />
            <Gamepad onGameInput={props.onGameInput} disabled={props.gameControlsDisabled} />
        </div>
    );
};