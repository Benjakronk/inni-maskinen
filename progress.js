// progress.js — stjernehåndtering for «Inni Maskinen».
// Hvert rom har én eller flere stjerner. Lagres som
//   im_<rom>_<stjerne> = "true"  i localStorage.
// Eksponeres som window.Progress.

(function () {
    const ROOMS = [
        { id: 'bits',   name: '0/1-fabrikken',     stars: 1 },
        { id: 'ram',    name: 'RAM-biblioteket',   stars: 1 },
        { id: 'disk',   name: 'Disk-arkivet',      stars: 1 },
        { id: 'cpu',    name: 'CPU-mølla',         stars: 1 },
        { id: 'buss',   name: 'Buss-motorveien',   stars: 1 },
        { id: 'gpu',    name: 'Skjermkortet',      stars: 1 },
        { id: 'nett',   name: 'Nettverkskortet',   stars: 1 },
        { id: 'os',     name: 'OS-tårnet',         stars: 1 },
        { id: 'kode',   name: 'Koderommet',        stars: 3 },
        { id: 'komp',   name: 'Kompilator-verkst.',stars: 1 }
    ];

    function key(room, star = 0) { return `im_${room}_s${star}`; }

    const Progress = {
        rooms: ROOMS,

        has(room, star = 0) {
            return localStorage.getItem(key(room, star)) === 'true';
        },

        give(room, star = 0) {
            if (this.has(room, star)) return false;
            localStorage.setItem(key(room, star), 'true');
            this._showBanner();
            return true;
        },

        starsFor(room) {
            const def = ROOMS.find(r => r.id === room);
            if (!def) return { earned: 0, total: 0 };
            let earned = 0;
            for (let s = 0; s < def.stars; s++) {
                if (this.has(room, s)) earned++;
            }
            return { earned, total: def.stars };
        },

        total() {
            let earned = 0, total = 0;
            ROOMS.forEach(r => {
                total += r.stars;
                for (let s = 0; s < r.stars; s++) if (this.has(r.id, s)) earned++;
            });
            return { earned, total };
        },

        renderStars(roomId) {
            const { earned, total } = this.starsFor(roomId);
            let s = '';
            for (let i = 0; i < total; i++) {
                s += `<span class="star${i < earned ? '' : ' dim'}">★</span>`;
            }
            return s;
        },

        _showBanner(text = '⭐ Stjerne!') {
            let el = document.querySelector('.star-banner');
            if (!el) {
                el = document.createElement('div');
                el.className = 'star-banner';
                document.body.appendChild(el);
            }
            el.textContent = text;
            el.classList.add('show');
            setTimeout(() => el.classList.remove('show'), 1600);
        },

        reset() {
            ROOMS.forEach(r => {
                for (let s = 0; s < r.stars; s++) localStorage.removeItem(key(r.id, s));
            });
        }
    };

    window.Progress = Progress;
})();
