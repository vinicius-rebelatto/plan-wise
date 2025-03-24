document.addEventListener('DOMContentLoaded', function () {
    const deleteIcon = document.querySelector('.modal-btn');
    const deleteIcon2 = document.querySelector('.modal-btn-2');
    const modal = document.getElementById('deleteModal');
    const modal2 = document.getElementById('deleteModal2');
    const closeModal = document.querySelector('.close');
    const cancelDelete = document.getElementById('cancelDelete');
    const cancelDelete2 = document.getElementById('cancelDelete2');
    if (deleteIcon) {
        deleteIcon.addEventListener('click', function () {
            modal.style.display = 'block';
        });
    }
    if (closeModal) {
        closeModal.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }
    if (cancelDelete) {
        cancelDelete.addEventListener('click', function () {
            modal.style.display = 'none';
        });
    }
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
})