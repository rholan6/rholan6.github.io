//calculation functions
function getMonthlyRate(annualRate) {
    return annualRate / 12;
}
function getNumMonths(years) {
    return years * 12;
}
function getMonthlyPayment(intRate, numMonths, principal) {
    var bottom = Math.pow(1 + intRate, -numMonths);
    bottom = 1 - bottom;
    var divide = intRate / bottom;
    return divide * principal;
}
//var rate = getMonthlyRate(0.69);
//var months = getNumMonths(15);
//console.log(getMonthlyPayment(rate, months, 1000));

//recieve input
var submitButton = document.querySelector("#submitButton");
submitButton.addEventListener("click", calculate, false);
function calculate() {
    var annual = document.querySelector("#yrRate").value;
    var monthly = getMonthlyRate(annual);
    var ddYears = document.querySelector("#yearDDL");
    var yearIndex = ddYears.selectedIndex;
    var years = ddYears[yearIndex].value;
    var months = getNumMonths(years);
    var principal = document.querySelector("#principal").value;
    var start = document.querySelector("#m1").value;
    var end = document.querySelector("#m2").value;
    console.log("Annual: " + annual);
    console.log("Monthly: " + monthly);
    console.log("Years: " + years);
    console.log("Months: " + months);
    console.log("Principal: " + principal);
    makeTable(monthly, months, principal, start, end);
    //makeTable2(monthly, months, principal);
}
function row(monthlyPay, pPaid, iPaid, pLeft) {
    this.monthlyPay = monthlyPay;
    this.pPaid = pPaid;
    this.iPaid = iPaid;
    this.pLeft = pLeft;
}
function makeTable(monthly, months, principal, start, end) {
    var tableZone = $("#fillMe");
    document.querySelector("#fillMe").innerHTML = "";
    tableZone.append("<h2>Schedule</h2>")
    tableZone.append('<table class = "table">');
    tableZone.append("<tr>");
    tableZone.append("<th>#</th>");
    tableZone.append("<th>Monthly Payment</th>");
    tableZone.append("<th>Principal Paid</th>");
    tableZone.append("<th>Interest Paid</th>");
    tableZone.append("<th>Principal Remaining</th>");
    tableZone.append("</tr>")
    var pPaid = 0;
    var iPaid = 0;
    var monthlyPay = getMonthlyPayment(monthly, months, principal);
    var pLeft = principal;
    var totalI = 0;
    var rows = [];
    rows.push(new row(0, 0, 0, 0)); //makes life easier by indexing the first month at 1
    for(var i = 1; i <= months; i++) {
        iPaid = monthly * pLeft;
        pPaid = monthlyPay - iPaid;
        pLeft = pLeft - pPaid;
        totalI += iPaid;
        rows.push(new row(monthlyPay, pPaid, iPaid, pLeft));
        /*tableZone.append("<tr>");
        tableZone.append("<td>" + i + "</td>");
        tableZone.append("<td>" + monthlyPay.toFixed(2) + "</td>");
        tableZone.append("<td>$" + pPaid.toFixed(2) + "</td>");
        tableZone.append("<td>$" + iPaid.toFixed(2) + "</td>");
        tableZone.append("<td>$" + pLeft.toFixed(2) + "</td>");
        tableZone.append("</tr>");*/
    }
    for(var i = start; i <= end; i++) {
        tableZone.append("<tr>");
        tableZone.append("<td>" + i + "</td>");
        tableZone.append("<td>" + rows[i].monthlyPay.toFixed(2) + "</td>");
        tableZone.append("<td>$" + rows[i].pPaid.toFixed(2) + "</td>");
        tableZone.append("<td>$" + rows[i].iPaid.toFixed(2) + "</td>");
        tableZone.append("<td>$" + rows[i].pLeft.toFixed(2) + "</td>");
        tableZone.append("</tr>");
    }
    tableZone.append("</table>");
    makeTable2(monthly, months, principal, monthlyPay, totalI);
}
function makeTable2(monthly, months, principal, monthlyPay, totalI) {
    var tableZone = $("#meToo");
    var total = monthlyPay * months;
    var ratio = total / principal;
    monthly = monthly * 100;
    document.querySelector("#meToo").innerHTML = "";
    tableZone.append("<h2>Summary</h2>");
    tableZone.append('<table class = "table">');
    tableZone.append("<tr>");
    tableZone.append("<th>Loan Amount</th>");
    tableZone.append("<th>Monthly Interest Rate</th>");
    tableZone.append("<th>Monthly Payment</th>");
    tableZone.append("<th>Total Paid</th>");
    tableZone.append("<th>Total Interest Paid</th>");
    tableZone.append("<th>Amount / Principal</th>");
    tableZone.append("</tr>");
    tableZone.append("<tr>");
    tableZone.append("<td>$" + principal/*.toFixed(2)*/ + "</td>");
    tableZone.append("<td>" + monthly + "%</td>");
    tableZone.append("<td>$" + monthlyPay.toFixed(2) + "</td>");
    tableZone.append("<td>$" + total.toFixed(2) + "</td>");
    tableZone.append("<td>$" + totalI.toFixed(2) + "</td>");
    tableZone.append("<td>" + ratio + "</td>");
    tableZone.append("</tr>");
    tableZone.append("</table>");
}
