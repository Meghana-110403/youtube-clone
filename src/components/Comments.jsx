import { useState } from 'react';

const Comments = ({ comments }) => {
    const [showAll, setShowAll] = useState(false);
    const displayComments = showAll ? comments : comments.slice(0, 5);

    return (
        <div className="comments-section">
            <h3>{comments.length} comments</h3>
            <div className="comment-input">
                <input type="text" placeholder="Add a comment...." />
                <button>Comment</button>
            </div>
            <div className="comments-list">
                {displayComments.map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-avatar">
                            <img
                                src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                                alt="avatar"
                            />
                        </div>
                        <div className="comment-content">
                            <div className="comment-author">
                                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                            </div>
                            <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
                            <div className="comment-actions">
                                <button>👍</button>
                                <span>{comment.snippet.topLevelComment.snippet.likeCount}</span>
                                <button>Reply</button>
                            </div>
                        </div>
                    </div>
                ))}
                {comments.length > 5 && (
                    <button onClick={() => setShowAll(!showAll)}>
                        {showAll ? 'Show less' : 'Show more'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Comments;