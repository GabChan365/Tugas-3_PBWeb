const statuslabel = {
    name: 'statuslabel',
    props: {
        qty: { type: Number, default: 0 },
        safety: { type: Number, default: 0 }
    },

    computed: {
        status() {
            if (this.qty <= 0) return 'unsafe';
            if (this.qty >= this.safety) return 'normal';
            return 'critical';
        },
        sText() {
            const labels = {
                normal: 'Stok Normal',
                critical: 'Stok Kritis',
                unsafe: 'Stok Kosong'
            };
            return labels[this.status];
        },
        sStyle() {
            const colors = {
                normal: 'lime',
                critical: 'orange',
                unsafe: 'red'
            };
            return { color: colors[this.status] };
        }
    },

    template: `<span :style="sStyle">{{ sText }}</span>`
};