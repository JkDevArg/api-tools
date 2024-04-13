import { Injectable } from '@nestjs/common';
const reader = require('xlsx')

@Injectable()
export class UploadService {
    constructor(){}

    async uploadFile() {
        const file = reader.readFile('uploads/OBAMA_FULL_DAA.xlsx');
        const sheetName = file.SheetNames[0];
        const sheetData = reader.utils.sheet_to_json(file.Sheets[sheetName]);
      
        const header = Object.keys(sheetData[0]);
        const modifiedData = sheetData.map((item) => {
          const modifiedItem = {};
      
          for (const key of header) {
            modifiedItem[key] = item[key] || null;
          }
      
          return modifiedItem;
        });
      
        return modifiedData;
      }
}
