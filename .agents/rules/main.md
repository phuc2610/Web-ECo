# Workspace Rules - Web-ECo (Minh Tuấn Mobile)

## VPS Configuration
- **Host / IP**: `160.191.86.107`
- **SSH Port**: `22`
- **User**: `root`
- **SSH Key**: `.ssh/vps1_key`

## Danh sách websites/projects đang hoạt động trên VPS
*Cực kỳ quan trọng: Server chạy nhiều dự án chung. Khi deploy hoặc restart, KHÔNG ĐƯỢC chạy `pm2 restart all` hoặc can thiệp vào các thư mục dự án khác.*

### 1. minhtuanphone.space (Web-ECo) - DỰ ÁN HIỆN TẠI
- **Loại**: `node-app` + `node-static`
- **Domain**: `https://minhtuanphone.space`
- **Admin**: `https://minhtuanphone.space/admin`
- **Local path**: Workspace root
- **Remote path**: `/var/www/minhtuanphone.space`
- **Nginx config**: `/etc/nginx/sites-available/minhtuanphone.space`
- **Backend Port**: `4000`
- **PM2 name**: `web-eco-api` (ID: 2)
- **SSL**: Let's Encrypt (`/etc/letsencrypt/live/minhtuanphone.space/`)
- **Lệnh restart an toàn**: `pm2 restart web-eco-api`

### 2. ngocphieupc.shop (DỰ ÁN KHÁC - KHÔNG ĐƯỢC ĐỘNG VÀO)
- **Remote path**: `/var/www/ngocphieupc.shop`
- **PM2 name**: `np-computer-api` (ID: 0)

### 3. ttknangiang.space (DỰ ÁN KHÁC - KHÔNG ĐƯỢC ĐỘNG VÀO)
- **Remote path**: `/var/www/ttknangiang.space`
- **PM2 name**: `ttknangiang-app` (ID: 1)
