// Receitas base. Quantidades preservadas da versão original.
        const ARMAS_RECIPES = {
            "Cilindro": { "Carvao": 16, "Pedra": 20, "Litio": 10 },
            "Spring": { "Borracha": 1, "Pedra": 50, "Barro": 10 },
            "Barrel": { "Borracha": 1, "Carvao": 15, "Barro": 15 },
            "Trigger": { "Pedra": 30, "Barra Cobre": 2, "Litio": 4 },
            "Gear": { "Barra Ouro": 1, "Bauxita": 50, "Litio": 10, "Barro": 50 }
        };
        const ARMAS = {
            "Revolver Navy Crossover": { "Barrel": 3, "Cilindro": 3, "Spring": 3, "Caixa de Ferramentas": 1 },
            "Revolver Apostador": { "Barrel": 2, "Cilindro": 1, "Spring": 2 },
            "Double Barrel Exotica": { "Borracha": 3, "Cilindro": 3, "Spring": 2 },
            "Navy Revolver": { "Cilindro": 4, "Spring": 3 },
            "Mauser Pistol": { "Barrel": 2, "Cilindro": 2, "Spring": 1 },
            "Evans Repeater": { "Cilindro": 2, "Gear": 2, "Spring": 1 },
            "Pump Shotgun": { "Caixa de Ferramentas": 1, "Cilindro": 3, "Gear": 3, "Trigger": 3 },
            "Semiauto Shotgun": { "Barrel": 2, "Caixa de Ferramentas": 2, "Cilindro": 3, "Gear": 3 },
            "Rollingblock Rifle": { "Caixa de Ferramentas": 2, "Cilindro": 3, "Gear": 10, "Trigger": 2, "Blueprint": 1 },
            "Lemat Revolver": { "Barrel": 3, "Cilindro": 3, "Spring": 2 },
            "SemiAuto Pistol": { "Barrel": 1, "Cilindro": 2, "Spring": 1 },
            "Winchester Repeater": { "Barrel": 1, "Caixa de Ferramentas": 1, "Cilindro": 3, "Gear": 2 },
            "Sawedoff Shotgun": { "Barrel": 2, "Gear": 2, "Spring": 2 },
            "Rifle Boltaction": { "Caixa de Ferramentas": 2, "Cilindro": 1, "Gear": 3, "Trigger": 1 }
        };
        const DESTILARIA = {
            "Álcool Destilado": {"Milho":20,"Açúcar":20,"Levedura":20,"Rolha":1,"Garrafa":1},
            "Aguardente": {"Açúcar":10,"Levedura":20,"Água":5,"Garrafa":1},
            "Vinho Tinto": {"Uvas":50,"Garrafa":10,"Rolha":2},
            "Bourbon": {"Milho":25,"Levedura":25},
            "Aguardente de Maçã": {"Garrafa":1,"Rolha":1,"Mel":2,"Aguardente":1,"Maçã":10},
            "Bebida Canábis": {"Açúcar":5,"Levedura":5,"Canábis":5},
            "Hidromel": {"Garrafa":1,"Rolha":1,"Mel":50,"Água":10,"Levedura":50},
            "Cidra de Maçã": {"Açúcar":50,"Maçã":20,"Água":10,"Rolha":1,"Garrafa":1},
            "Pirate Rum": {"Açúcar":25,"Levedura":25},
            "Vermute": {"Garrafa":10,"Rolha":2,"Uvas":50},
            "Vodka": {"Rolha":1,"Garrafa":1,"Água":5,"Levedura":25,"Batata":25},
            "Coca-Cola": {"Folha de Coca":25,"Açúcar":25,"Saco de Café":5,"Blueprint Coca-Cola":1},
            "Mama Juana": {"Rolha":1,"Garrafa":1,"Vinho Tinto":10,"Mel":10,"Canela":20},
            "Moonshine Rooster": {"Bebida Canábis":5,"Hidromel":1,"Kiwi":5,"Álcool Destilado":5,"Milho":2},
            "Moonshine Hank": {"Aguardente de Maçã":1,"Pitaya":10,"Garrafa":1,"Rolha":1,"Brandy Mexicano":1}
        };
        const FARMACOS = {
            "Heroína": {"Ópio":50,"Água":5,"Frasco":1},
            "Tónico Vital de Ginseng": {"Ginseng":25,"Mel":2,"Lítio":2,"Garrafa":1,"Rolha":1},
            "Xarope Cannabis": {"Xarope de Tosse":1,"Canábis":2,"Água":1}
        };
        const BARCO = { "Vinho Tinto": {"Uvas":2000,"Garrafa":400,"Rolha":80} };

        // direct = ingredientes sem receita entram nos materiais brutos
        const CATS = {
            armas:      { recipes: ARMAS_RECIPES, items: ARMAS,      direct:false, title:"Selecione as Armas",    rec:"Receitas de Componentes", sub:"Calculadora de Materiais para Armas" },
            destilaria: { recipes: DESTILARIA,    items: DESTILARIA, direct:true,  title:"Selecione as Bebidas",  rec:"Receitas da Destilaria",  sub:"Calculadora de Materiais da Destilaria" },
            farmacos:   { recipes: FARMACOS,      items: FARMACOS,   direct:true,  title:"Selecione os Fármacos", rec:"Receitas de Fármacos",    sub:"Calculadora de Materiais de Fármacos" }
        };