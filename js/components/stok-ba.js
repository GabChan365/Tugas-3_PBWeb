const stockba = {
    name: 'stockba',
    props: {
        items: {
            type: Array,
            default: () => []
        }
    },
    emits: ['edit-item', 'delete-item'],

    methods: {
        currency(value) {
            return 'Rp. ' + Number(value || 0).toLocaleString('id-ID');
        }
    },

    template: `
        <table class="listBA" style="width:100%;">
            <thead>
                <tr>
                    <th>Judul</th>
                    <th>Kategori</th>
                    <th>UPBJJ</th>
                    <th>Jumlah Stok</th>
                    <th>Harga</th>
                    <th>Status</th>
                    <th>Opsi</th>
                </tr>
            </thead>
            <tbody class="listBA">
                <tr v-for="item in items" :key="item.kode">
                    <td><b>{{ item.judul }}</b><br><span style="font-size:80%;">{{ item.kode }}</span></td>
                    <td>{{ item.upbjj }}</td>
                    <td>{{ item.kategori }}</td>
                    <td>{{ item.qty }} pcs</td>
                    <td>{{ currency(item.harga) }}</td>
                    <td>
                        <div class="tooltip">
                            <b><statuslabel :qty="item.qty" :safety="item.safety"></statuslabel></b>
                        <span class="tooltip-text" v-html="item.catatanHTML"></span>
                        </div>
                    </td>
                    <td>
                        <button @click="$emit('edit-item', item)" style="border-color: yellow;">Edit</button>
                        <button @click="$emit('delete-item', item)" style="border-color: red;">Hapus</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `
};