const tracking = {
    name: 'tracking',
    props: {
        trackinglist: {
            type: Array,
            default: () => []
        }
    },
    emits: ['add-progress'],

    template: `
        <div class="dataTracking" v-for="item in trackinglist" :key="item.nomorDO">
        <h3><center>Status Pengiriman</center></h3>
            <h4 style="text-align: center;">Status saat ini: <span id="status">{{ item.status }}</span></h4>
            <h5><span style="float: left; font-weight: 500;">Nama</span><span style="float: right;" id="nama">{{ item.nama }}</span></h5><br>
            <h5><span style="float: left; font-weight: 500;">NIM</span><span style="float: right;" id="nim">{{ item.nim }}</span></h5><br>
            <h5><span style="float: left; font-weight: 500;">Nomor DO</span><span style="float: right;" id="DOnumber">{{ item.nomorDO }}</span></h5><br>
            <h5><span style="float: left; font-weight: 500;">Kode Paket</span><span style="float: right;" id="paket">{{ item.paket }}</span></h5><br>
            <h5><span style="float: left; font-weight: 500;">Tanggal pengiriman</span><span style="float: right;" id="tanggalKirim">{{ item.tanggalKirim }}</span></h5><br>
            <h5><span style="float: left; font-weight: 500;">Ekspedisi</span><span style="float: right;" id="ekspedisi">{{ item.ekspedisi }}</span></h5><br>

            <h4>Progres Pengiriman</h4>
            <div v-for="(progress, index) in item.perjalanan" :key="index">
                <h5 style="font-weight: 600; text-align: left;">{{ progress.waktu }}</h5>
                <h5 style="text-align: left; font-weight: 400; padding-bottom: 10px;">{{ progress.keterangan }}</h5>
            </div>
            <div v-if="item.status !== 'Selesai'" v-on:keyup.enter="$emit('add-progress', item)">
                <input class="newProgress" type="text" v-model="item.newProgress" placeholder="Masukkan progres terbaru untuk data pengiriman berikut">
                <button class="DObutton" @click="$emit('add-progress', item)">Tambah</button>
            </div>
        </div>
    `
};