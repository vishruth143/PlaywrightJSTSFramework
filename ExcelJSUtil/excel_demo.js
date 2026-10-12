const ExcelJS = require('exceljs');
const path = require('path');

const filePath = path.join(__dirname, 'excel_download_test.xlsx');

async function writeExcelTest(searchText, replaceText, change, filePath) {    
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = workbook.getWorksheet('Sheet1');
    const output = await readExcel(worksheet, searchText);

    const cell = worksheet.getCell(output.row, output.column+change.colChange);
    cell.value = replaceText;
    await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
    let output = {row:-1, column:-1};
    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => { 
            if (cell.value === searchText) {
                console.log(rowNumber);
                console.log(colNumber);
                output.row = rowNumber;
                output.column = colNumber;
            }
        });
    });
    return output;
}

writeExcelTest("Banana", 350, {rowChange:0, colChange:2}, filePath);