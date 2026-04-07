// Contoh implementasi JavaScript: Validasi form komentar dan daftar komentar
document.addEventListener('DOMContentLoaded', function() {
    loadComments();
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            if (validateCommentForm()) {
                addComment();
                form.reset();
            }
        });
    }
});

function validateCommentForm() {
    const nameInput = document.querySelector('input[name="name"]');
    const commentInput = document.querySelector('textarea[name="comment"]');
    if (!nameInput.value.trim() || !commentInput.value.trim()) {
        alert('Please fill in both name and comment fields.');
        return false;
    }
    return true;
}

function addComment() {
    const nameInput = document.querySelector('input[name="name"]');
    const commentInput = document.querySelector('textarea[name="comment"]');
    const name = nameInput.value.trim();
    const comment = commentInput.value.trim();
    const commentsList = document.getElementById('comments-list');
    const id = Date.now().toString();

    renderComment({ id, name, comment }, commentsList);
    saveComment({ id, name, comment });
}

function renderComment(commentObj, container) {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.dataset.id = commentObj.id;
    commentDiv.innerHTML = `
        <div class="comment-content">
            <strong>${commentObj.name}:</strong>
            <span class="comment-text">${commentObj.comment}</span>
        </div>
        <button type="button" class="comment-delete" data-id="${commentObj.id}">Hapus</button>
    `;

    commentDiv.querySelector('.comment-delete').addEventListener('click', function() {
        deleteComment(commentObj.id);
    });

    container.appendChild(commentDiv);
}

function saveComment(commentObj) {
    const key = 'shared_comments';
    let comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments.push(commentObj);
    localStorage.setItem(key, JSON.stringify(comments));
}

function deleteComment(id) {
    const key = 'shared_comments';
    let comments = JSON.parse(localStorage.getItem(key) || '[]');
    comments = comments.filter(comment => comment.id !== id);
    localStorage.setItem(key, JSON.stringify(comments));

    const commentDiv = document.querySelector(`.comment[data-id="${id}"]`);
    if (commentDiv) {
        commentDiv.remove();
    }
}

function loadComments() {
    const key = 'shared_comments';
    let comments = JSON.parse(localStorage.getItem(key) || '[]');
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    let updated = false;
    comments = comments.map((commentObj, index) => {
        if (!commentObj.id) {
            updated = true;
            return { ...commentObj, id: `${Date.now()}-${index}` };
        }
        return commentObj;
    });

    if (updated) {
        localStorage.setItem(key, JSON.stringify(comments));
    }

    comments.forEach(commentObj => renderComment(commentObj, commentsList));
}