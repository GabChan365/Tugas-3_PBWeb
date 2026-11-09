//Setup Awal
const { createApp } = Vue;

const emptyItem = () => ({
    kode: '',
    judul: '',
    kategori: '',
    upbjj: '',
    lokasiRak: '',
    harga: null,
    qty: null,
    safety: null,
    catatanHTML: ''
});

const emptyDOTracking = () => ({
    nim: '',
    nama: '',
    ekspedisi: '',
    paket: '',
    tanggalKirim: ''
});

const app = createApp({
    data() {
        return {
            tab: 'home',

            stok: [],
            upbjjList: [],
            kategoriList: [],
            pengirimanList: [],
            paket: [],
            trackingX: [],

            newItem: emptyItem(),
            newDOTracking: emptyDOTracking(),

            isEdit: false,
            editIndex: null,
            filterUpbjj: '',
            filterKategori: '',
            sort: 'judul',
            sortDir: 'asc',
            showForm: false,
            search: '',
            filterTracking: []
        };
    },

    computed: {
        // Logika untuk Filter Stok
        filterStok() {
            const listStok = this.stok.filter(item => {
                const Upbjj = this.filterUpbjj ? item.upbjj === this.filterUpbjj : true;
                const Kategori = this.filterKategori ? item.kategori === this.filterKategori : true;
                return Upbjj && Kategori;
            });

            const dir = this.sortDir === 'desc' ? -1 : 1;

            return listStok.sort((x, y) => {
                if (this.sort === 'harga') return (x.harga - y.harga) * dir;
                if (this.sort === 'qty') return (x.qty - y.qty) * dir;
                return x.judul.localeCompare(y.judul) * dir;
            });
        },
        // Logika untuk Pengisian Nomor DO Baru secara Otomatis
        newNoDO() {
            let year = new Date().getFullYear();
            const seq = (this.trackingX?.length || 0) + 1;
    
            return `DO${year}-${String(seq).padStart(4, '0')}`;
        },
        
        // Untuk menampilkan Detail Paket
        detail() {
            return this.getDetail(this.newDOTracking.paket);
        }
    },

    methods: {
        //Fungsi untuk Tambah, Edit, dan Hapus Data Stok
        activeForm() {
            this.confirmForm();
            this.showForm = true;
        },
        currency(value) {
            if (!value) return 'Rp. 0';
            return 'Rp. ' + Number(value).toLocaleString('sv-SE');
        },

        reset() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.sort = 'judul';
            this.sortDir = 'asc';
        },
        
        confirmForm() {
            this.newItem = emptyItem();
            this.isEdit = false;
            this.editIndex = null;
            this.showForm = false;
        },

        resetForm() {
            alert('Form telah di-reset');
            this.newItem = emptyItem();
        },

        addItem() {
            const n = this.newItem;

            if (!n.kode || !n.judul || n.qty === null || n.qty === '' || n.safety === null || n.safety === '') {
                alert('Lengkapi isi data terlebih dahulu!');
                return;
            }

            if (n.qty === 0) {
                n.catatanHTML = 'Stok bahan ajar <i><b>kosong</b></i>, segera re-order!';
            } else if (n.qty < n.safety) {
                n.catatanHTML = 'Stok bahan ajar <i>menipis</i>, prioritaskan re-order!';
            } else {
                n.catatanHTML = 'Stok bahan ajar mencukupi.';
            }

            if (this.isEdit && this.editIndex !== null) {
                this.stok.splice(this.editIndex, 1, { ...n });
            } else {
                const isExist = this.stok.some(s => s.kode === n.kode);
                if (isExist) {
                    alert('Kode bahan ajar sudah terdaftar sebelumnya!');
                    return;
                }
                this.stok.push({ ...n });
            }

            this.confirmForm();
            alert('Berhasil menyimpan data Bahan Ajar!');
        },

        setEdit(item) {
            this.isEdit = true;
            this.showForm = true;
            this.editIndex = this.stok.findIndex(s => s.kode === item.kode);
            this.newItem = { ...item };
        },

        deleteItem(item) {
            Swal.fire({
                title: 'Apakah Anda yakin ingin menghapus data bahan ajar ' + [item.kode] + '?',
                html: '<h5 style="color: red;">Data yang telah dihapus tidak akan dapat dikembalikan.</h5>',
                showCancelButton: true,
                confirmButtonColor: '#ff3333',
                cancelButtonColor: '#3366ff',
                confirmButtonText: 'Ya',
                cancelButtonText: 'Tidak'
            }).then(result => {
                if (result.isConfirmed) {
                    const deleting = this.stok.findIndex(s => s.kode === item.kode);
                    if (deleting !== -1) {
                        this.stok.splice(deleting, 1);
                        Swal.fire({
                            title: 'Data bahan ajar ' + [item.kode] + ' berhasil terhapus!',
                            text: 'Klik OK untuk melanjutkan!',
                            confirmButtonColor: '#33ff45'
                        });
                    }
                }
            });
        },

        cancelEdit() {
            alert('Proses dibatalkan!');
            this.confirmForm();
        },
        
        //Fungsi untuk Mencari, Menambahkan, dan Mengubah Data Pengiriman (Tracking)
        getDetail(kodePaket) {
            return this.paket.find(p => p.kode === kodePaket) || { isi: [], harga: 0 };
        },

        addDOData() {

            if (!this.newDOTracking.nim || !this.newDOTracking.nama || !this.newDOTracking.paket || !this.newDOTracking.ekspedisi) {
                alert("Data yang dimasukkan belum lengkap!");
                return;
            }

            const newNoDO = this.newNoDO;
            const detail = this.detail;

            let newData = {
                nomorDO: newNoDO,
                nim: this.newDOTracking.nim,
                nama: this.newDOTracking.nama,
                status: "Dalam perjalanan",
                ekspedisi: "JNE " + this.newDOTracking.ekspedisi,
                tanggalKirim: this.newDOTracking.tanggalKirim || new Date().toISOString().split('T')[0],
                paket: this.newDOTracking.paket,
                total: detail.harga,
                perjalanan: [
                    {
                        waktu: new Date().toLocaleString('sv-SE'),
                        keterangan: "Pesanan telah diproses."
                    }
                ]
            };

            this.trackingX.push(newData);
            this.filterTracking = [newData];
            this.newDOTracking = { nim: '', nama: '', ekspedisi: '', paket: '', tanggalKirim: '' };
            alert(`Data pengiriman dengan nomor DO ${newNoDO} telah berhasil dibuat!`);
        },

        searchDO() {
            let query = this.search.toLowerCase();
            if (!this.search || this.search.trim() === '') {
                this.filterTracking = [];
                alert("Silahkan masukkan nomor DO atau NIM yang ingin dicari terlebih dahulu!")
                return;
            }

            this.filterTracking = this.trackingX.filter(item => {
                let searchDO = item.nomorDO ? item.nomorDO.toLowerCase() : '';
                let searchNIM = item.nim ? item.nim.toLowerCase() : '';
                return searchDO.includes(query) || searchNIM.includes(query);

            });
        },

        updateProgress(item) {
            const DOFinished = item.perjalanan.some(p =>
                p.keterangan.toLowerCase().includes("selesai") ||
                p.keterangan.toLowerCase().includes("sampai di tujuan")
            );

            if (DOFinished) {
                item.status = "Selesai";
            } else {
                item.status = "Dalam perjalanan";
            }
        },

        resetSearch() {
            this.search = '';
            this.filterTracking=[];
        },

        addProgress(item) {
            if (!item.newProgress) {
                alert("Keterangan baru untuk data pengiriman belum dimasukkan.");
                return;
            }

            item.perjalanan.push({
                waktu: new Date().toLocaleString('sv-SE'),
                keterangan: item.newProgress
            });

            this.updateProgress(item);

            if (item.newProgress.toLowerCase().includes("tiba di tujuan")) {
                item.status = "Selesai";
            }

            item.newProgress = '';
            alert("Berhasil menambahkan keterangan baru.");
        },

        resetNewProgress(item) {
            item.newProgress = '';
            alert("Kolom keterangan telah di-reset!");
        },
    },
    
    watch: {
        // Filter Data Stok
        filterUpbjj() {
                this.filterKategori = '';
            }
        },

        // Fetching Data
        created() {
            fetch('data/dataBahanAjar.json')
            .then(response => response.json())
            .then(data => {
                this.stok = data.stok;
                this.upbjjList = data.upbjjList;
                this.kategoriList = data.kategoriList;
                this.pengirimanList = data.pengirimanList;
                this.paket = data.paket;
                this.trackingX = (data.tracking || []).flatMap(t => {
                if (t.nomorDO) return [t];
                    return Object.entries(t).map(([nomorDO, n]) => ({
                        nomorDO, ...n, nim: String(n.nim ?? '')
                    }));
                });
                this.filterTracking = [];
            })
            .catch(() => {
                alert('Tidak dapat memuat data JSON');
            });
        }
});

app.component('stockba', stockba);
app.component('statuslabel', statuslabel);
app.component('tracking', tracking);
app.mount('#app');