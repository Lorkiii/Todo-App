document.addEventListener('DOMContentLoaded', function() {
  const addTaskBtn = document.getElementById('add-task-btn');
  const addTaskModalEl = document.getElementById('addTaskModal');


  addTaskBtn.addEventListener('click', function() {
    if (addTaskModalEl && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(addTaskModalEl);
      modal.show();
    } else if (addTaskModalEl) {
      addTaskModalEl.style.display = 'block';
    }
  });

});