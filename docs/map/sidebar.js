/**
 * Sidebar con selezione categorie raggruppate per sezioni
 */
const SidebarManager = {
    categoryGroups: [
        {
            id: 'unesco',
            label: 'Centro Storico UNESCO',
            icon: '🏛️',
            selected: true,
            isSpecial: true
        },
        {
            label: 'Explore',
            icon: '🗺️',
            expanded: false,
            categories: [
                { id: 'experiences', label: 'Experiences', icon: '✨', selected: false },
                { id: 'private-space', label: 'Private Space', icon: '🔐', selected: false },
                { id: 'nightlife', label: 'Nightlife', icon: '🎶', selected: false }
            ]
        },
        {
            label: 'Food & Wine',
            icon: '🍷',
            expanded: false,
            categories: [
                { id: 'restaurants', label: 'Restaurants', icon: '🍽️', selected: false },
                { id: 'street-food', label: 'Street Food', icon: '🌮', selected: false },
                { id: 'wine', label: 'Wine', icon: '🍇', selected: false }
            ]
        },
        {
            label: 'Services',
            icon: '🔧',
            expanded: false,
            categories: [
                { id: 'mobility', label: 'Mobility', icon: '🚴', selected: false },
                { id: 'ship-package', label: 'Ship Package', icon: '📦', selected: false },
                { id: 'wellness', label: 'Wellness', icon: '💆', selected: false },
                { id: 'luggage-store', label: 'Luggage Store', icon: '🎒', selected: false }
            ]
        },
        {
            label: 'Essentials',
            icon: '⚡',
            expanded: false,
            categories: [
                { id: 'shopping', label: 'Shopping', icon: '🛍️', selected: false },
                { id: 'water', label: 'Water', icon: '💧', selected: false },
                { id: 'at-your-door', label: 'At Your Door', icon: '🚪', selected: false }
            ]
        }
    ],
    activeCategory: 'unesco',
    onCategoryChange: null,
    init(callback) {
        this.onCategoryChange = callback;
        this.render();
    },
    render() {
        const list = document.getElementById('categories-list');
        if (!list) return;
        list.innerHTML = '';

        this.categoryGroups.forEach((group, groupIndex) => {
            if (group.isSpecial) {
                // UNESCO - sempre visibile e selezionabile
                const item = document.createElement('div');
                item.className = `cat-item${group.selected ? ' active' : ''}`;
                item.innerHTML = `<span class="cat-icon">${group.icon}</span> <span>${group.label}</span>`;
                item.onclick = () => {
                    this.activeCategory = group.id;
                    if (this.onCategoryChange) this.onCategoryChange(group.id);
                    this.updateSelection(group.id);
                    this.render();
                    this.closeSidebarMobile();
                };
                list.appendChild(item);
                
                // Aggiungi separator dopo UNESCO
                const bre = document.createElement('br');
                list.appendChild(bre);
                const hr = document.createElement('hr');
                list.appendChild(hr);
                const br = document.createElement('br');
                list.appendChild(br);
            } else {
                // Gruppi con categorie annidate
                const groupContainer = document.createElement('div');
                groupContainer.className = 'cat-group';

                // Header del gruppo (cliccabile per espandere/collassare)
                const groupHeader = document.createElement('div');
                groupHeader.className = `cat-group-header${group.expanded ? ' expanded' : ''}`;
                groupHeader.innerHTML = `<span class="cat-icon">${group.icon}</span> <span>${group.label}</span> <span class="expand-icon">${group.expanded ? '▼' : '▶'}</span>`;
                groupHeader.onclick = () => {
                    group.expanded = !group.expanded;
                    this.render();
                };
                groupContainer.appendChild(groupHeader);

                // Lista categorie del gruppo
                if (group.expanded) {
                    const categoryList = document.createElement('div');
                    categoryList.className = 'cat-group-items';
                    
                    group.categories.forEach(cat => {
                        const catItem = document.createElement('div');
                        catItem.className = `cat-item cat-subitem${cat.selected ? ' active' : ''}`;
                        catItem.innerHTML = `<span class="cat-icon">${cat.icon}</span> <span>${cat.label}</span>`;
                        catItem.onclick = () => {
                            if (cat.selected) {
                                cat.selected = false;
                                this.activeCategory = null;
                                if (this.onCategoryChange) this.onCategoryChange(null);
                            } else {
                                this.updateSelection(cat.id);
                                this.activeCategory = cat.id;
                                if (this.onCategoryChange) this.onCategoryChange(cat.id);
                            }
                            this.render();
                            this.closeSidebarMobile();
                        };
                        categoryList.appendChild(catItem);
                    });
                    groupContainer.appendChild(categoryList);
                }

                list.appendChild(groupContainer);
            }
        });
    },
    updateSelection(categoryId) {
        // Deseleziona tutte le categorie tranne UNESCO
        this.categoryGroups.forEach(group => {
            if (!group.isSpecial && group.categories) {
                group.categories.forEach(cat => {
                    cat.selected = (cat.id === categoryId);
                });
            }
        });
    },
    closeSidebarMobile() {
        // Chiudi sidebar su mobile dopo la selezione
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
};

//aggiungi qui le voci della sidebar della mappa interattiva