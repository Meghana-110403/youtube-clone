import { useState } from 'react';
import { getStored, STORAGE_KEYS } from '../utils/localStore';

const Subscriptions = () => {
    const [channels] = useState(() => Object.values(getStored(STORAGE_KEYS.SUBSCRIPTIONS, {})));

    return (
        <div className="home">
            <h2 className="page-title">Subscriptions</h2>
            {channels.length === 0 ? (
                <div className="no-videos">
                    <p>Channels you subscribe to will show up here.</p>
                </div>
            ) : (
                <div className="subscriptions-list">
                    {channels.map((channel) => (
                        <div key={channel.channelId} className="subscription-item">
                            <div className="channel-avatar-large">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(channel.channelTitle)}&background=303030&color=fff`}
                                    alt={channel.channelTitle}
                                />
                            </div>
                            <span>{channel.channelTitle}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Subscriptions;