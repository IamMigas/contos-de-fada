        const CRAFT_LOCATIONS = { 'Mauser Pistol': { x: 0.8136623741200927, y: 0.4671428762022888, title: 'Mauser Pistol', type: 'Craft de armas', color: '#30d5e0' } };
        // Tall Trees: red marker in the supplied Manzanita Post reference.
        CRAFT_LOCATIONS['Revolver Navy Crossover'] = { x: 0.4379275394208803, y: 0.588938568578772, title: 'Revolver Navy Crossover', type: 'Craft de armas', color: '#30d5e0', site: 'tall-trees' };
        CRAFT_LOCATIONS['Revolver Apostador'] = { x: 0.4379275394208803, y: 0.588938568578772, title: 'Revolver Apostador', type: 'Craft de armas', color: '#30d5e0', site: 'tall-trees' };
        CRAFT_LOCATIONS['Double Barrel Exotica'] = { x: 0.4379275394208803, y: 0.588938568578772, title: 'Double Barrel Exotica', type: 'Craft de armas', color: '#30d5e0', site: 'tall-trees' };
        CRAFT_LOCATIONS['Mauser Pistol'].site = 'bayou-nwa';
        ['Evans Repeater', 'Pump Shotgun', 'Remington 1858'].forEach(name => {
            CRAFT_LOCATIONS[name] = { ...CRAFT_LOCATIONS['Mauser Pistol'], title: name };
        });

const LOCATION_DETAILS = {
 'bayou-nwa': {region:'Bayou Nwa', description:'Sudoeste de Lagras, na margem interior do rio.', reference:'./assets/reference-bayou.png', status:'Assinalado pelo utilizador; alinhado com a imagem de referência.'},
 'tall-trees': {region:'Tall Trees', description:'Sudoeste de Manzanita Post, no ponto vermelho da referência.', reference:'./assets/reference-tall-trees.png', status:'Assinalado pelo utilizador; alinhado com a imagem de referência.'}
};
