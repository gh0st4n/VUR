# VUR (Void User Repo)

VUR adalah repositori komunitas untuk T4n OS dan Void Linux yang memungkinkan pengguna untuk mengembangkan, men-share, dan mengelola paket di luar repositori resmi. Konsepnya mirip dengan AUR (Arch User Repository), namun disesuaikan dengan ekosistem XBPS dan build system Void.

---

## Tujuan Utama

* Memberikan ruang bagi komunitas untuk menambahkan paket yang tidak tersedia di repositori resmi.
* Mendukung modifikasi paket (patch tambahan, build optimasi, versi custom).
* Meningkatkan fleksibilitas dan kreativitas pengguna dalam eksplorasi sistem.

---

## Struktur VUR

Setiap paket dalam VUR menggunakan format template Void Linux (`template`) yang berisi:

```
pkgname=
pkgver=
pkgrel=
build_style=
depends=
short_desc=
maintainer=
license=
source=
checksum=
```

Contoh struktur direktori paket:

```
vur/
 └── example-pkg/
     ├── template
     └── patches/
         └── fix-build.patch
```

---

## Cara Menggunakan VUR

### **Install Paket dari VUR**

Gunakan helper `T4n-Manpy`:

```bash
t4n-manpy install nama-paket
```

### **Update Paket**

```bash
t4n-manpy update nama-paket
```

### **Build Paket Manual (Tanpa Helper)
