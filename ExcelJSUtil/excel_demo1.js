const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, 'excel_download_test.xlsx');

const workbook = new ExcelJS.Workbook();

workbook.xlsx.readFile(filePath).then(() => {
    const worksheet = workbook.getWorksheet('Sheet1');
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => { 
            console.log(cell.value);
        });
    });
});