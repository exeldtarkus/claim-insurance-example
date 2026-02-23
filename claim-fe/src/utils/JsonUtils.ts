/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";

interface JsonData {
  [key: string]: any;
}

export class JsonUtils {
  /**
   * Create and save a JSON file.
   * @param jsonData - The data to be saved as JSON.
   * @param fileName - The name of the file to save the JSON data. Defaults to "data.json".
   * @param folderPath - The folder where the file will be saved. Defaults to "data".
   * @returns A promise that resolves to the file path if successful, or rejects with an error message.
   */
  static async create(jsonData: JsonData, fileName: string = "data.json", folderPath: string = "src/output"): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const fullFolderPath = path.join(process.cwd(), folderPath);
        if (!fs.existsSync(fullFolderPath)) {
          fs.mkdirSync(fullFolderPath, { recursive: true });
        }

        const filePath = path.join(fullFolderPath, fileName);

        fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

        resolve(filePath);
      } catch (error) {
        reject(`Failed to create JSON file: ${(error as Error).message}`);
      }
    });
  }

  /**
   * Remove a JSON file given the file path.
   * @param filePath - The full path to the file that should be removed.
   * @returns A promise that resolves to a success message if the file is removed, or rejects with an error message.
   */
  static async remove(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          resolve(`File removed successfully: ${filePath}`);
        } else {
          reject(`File not found: ${filePath}`);
        }
      } catch (error) {
        reject(`Failed to remove JSON file: ${(error as Error).message}`);
      }
    });
  }
}
