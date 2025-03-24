document.addEventListener("DOMContentLoaded", function() {
    const expenseId = document.getElementById("expense_id").value;
    const rejectBtn = document.getElementById("reject");
    const approveBtn = document.getElementById("approve");

    rejectBtn.addEventListener("click", function() {
        window.location.href = `/dashboard/expenses/approve/${expenseId}/?approved=false`;
    });

    approveBtn.addEventListener("click", function() {
        window.location.href = `/dashboard/expenses/approve/${expenseId}/?approved=true`;
    });
});