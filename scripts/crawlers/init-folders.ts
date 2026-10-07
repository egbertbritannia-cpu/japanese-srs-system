import { DriveFolderManager } from './drive-folder-manager';

async function main() {
  console.log('--- KHỞI TẠO 5 THƯ MỤC LƯU TRỮ TRÊN 15TB GOOGLE DRIVE ---');
  const folders = await DriveFolderManager.initFolders();
  console.log('✅ Hoàn tất khởi tạo 5 thư mục:');
  console.log(JSON.stringify(folders, null, 2));
}

main().catch(err => {
  console.error('Lỗi khởi tạo thư mục:', err);
  process.exit(1);
});
