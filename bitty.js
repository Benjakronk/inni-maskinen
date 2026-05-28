// bitty.js — Bittys dialogboble.
// Bruk: window.Bitty.say("...", { actions: [{label, callback}] })
// Hver side må ha en .bitty-bar med .bitty og .bitty-bubble og evt. .bitty-actions.
// Lyd-hook er forberedt: kall window.Bitty.playBlip(); hvis du legger til lyd senere.

(function () {
    const Bitty = {
        _bubble: null,
        _actions: null,
        _typing: false,

        init() {
            this._bubble = document.querySelector('.bitty-bubble .bubble-text');
            this._actions = document.querySelector('.bitty-actions');
            const sprite = document.querySelector('.bitty');
            if (sprite) {
                sprite.addEventListener('click', () => {
                    // Klikk på Bitty viser siste melding på nytt
                    if (this._lastSay) this.say(this._lastSay.text, this._lastSay.opts);
                });
            }
        },

        /**
         * Vis tekst i Bittys boble.
         * opts.actions = [{ label, callback, primary? }]
         * opts.instant = true → hopp over typewriter
         */
        say(text, opts = {}) {
            this._lastSay = { text, opts };
            if (!this._bubble) this.init();
            if (!this._bubble) return;

            this._actions.innerHTML = '';

            if (opts.instant) {
                this._bubble.innerHTML = text;
            } else {
                this._typewriter(text);
            }

            (opts.actions || []).forEach(a => {
                const btn = document.createElement('button');
                btn.textContent = a.label;
                if (a.muted) btn.classList.add('muted');
                btn.addEventListener('click', () => {
                    a.callback?.();
                });
                this._actions.appendChild(btn);
            });

            this.playBlip();
        },

        _typewriter(html) {
            // Skriv ut tegn for tegn, men bevar HTML-tagger.
            this._typing = true;
            const target = this._bubble;
            target.innerHTML = '';
            let i = 0;
            const tokens = this._tokenize(html);
            const step = () => {
                if (!this._typing) { target.innerHTML = html; return; }
                if (i >= tokens.length) { this._typing = false; return; }
                target.innerHTML = tokens.slice(0, i + 1).join('');
                i++;
                setTimeout(step, 18);
            };
            step();
        },

        _tokenize(html) {
            // Del strengen i biter. Tags telles som ett tegn for typewriter.
            const out = [];
            let i = 0;
            while (i < html.length) {
                if (html[i] === '<') {
                    const end = html.indexOf('>', i);
                    out.push(html.slice(i, end + 1));
                    i = end + 1;
                } else {
                    out.push(html[i]);
                    i++;
                }
            }
            return out;
        },

        // Hopp over typewriter på klikk på boblen
        skip() {
            this._typing = false;
            if (this._lastSay) this._bubble.innerHTML = this._lastSay.text;
        },

        // Lydhook — koble på senere ved å overstyre denne
        playBlip() {
            // Tom som standard. Eksempel for senere:
            //   const ctx = new AudioContext();
            //   const o = ctx.createOscillator(); ...
        }
    };

    window.Bitty = Bitty;
    document.addEventListener('DOMContentLoaded', () => {
        Bitty.init();
        // Klikk på boblen hopper over typewriter
        const bub = document.querySelector('.bitty-bubble');
        if (bub) bub.addEventListener('click', () => Bitty.skip());
    });
})();
