import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const SignInModal = ({ onClose }) => {
    const [name, setName] = useState('');
    const { signIn } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        signIn(name);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h3>Sign in</h3>
                <p className="modal-subtitle">
                    This is a local demo sign-in — it only stores a name in your browser,
                    no real account is created.
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter a display name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <div className="modal-actions">
                        <button type="button" className="modal-cancel" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="modal-confirm">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInModal;