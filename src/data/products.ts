import imperialPave from '../assets/products/imperial-pave-detail.png';
import mirrored24k from '../assets/products/mirrored-24k-detail.png';
import obsidianStage from '../assets/products/obsidian-stage.jpg';
import auroraTitanium from '../assets/products/aurora-titanium.jpg';
import roseGoldAtelier from '../assets/products/rose-gold-atelier.jpg';
import carbonNocturne from '../assets/products/carbon-nocturne.jpg';
import sapphireSignature from '../assets/products/sapphire-signature.jpg';
import copperResonance from '../assets/products/copper-resonance.jpg';
import pearlEdition from '../assets/products/pearl-edition.jpg';

export const products = [
	{ slug: 'imperial-pave', name: 'Imperial Pavé', finish: 'Ouro 24K · Micro-pavé', description: 'Ouro polido e cravação luminosa em uma edição inspirada na alta joalheria.', price: '$4,900', image: imperialPave, alt: 'Fones dourados com brasão geométrico e pedras pavé', status: 'Edição atual' },
	{ slug: 'mirrored-24k', name: 'Mirrored 24K', finish: 'Ouro espelhado · Corpo transparente', description: 'Superfície espelhada que revela os detalhes internos em um acabamento marcante.', price: '$3,900', image: mirrored24k, alt: 'Fones com placas espelhadas douradas e corpo transparente', status: 'Edição atual' },
	{ slug: 'obsidian-stage', name: 'Obsidian Stage', finish: 'Preto · Filete dourado', description: 'Linhas escuras e discretos reflexos metálicos para uma presença mais sóbria.', price: '$3,200', image: obsidianStage, alt: 'Fones pretos com contorno dourado sobre pedra vulcânica', status: 'Edição atual' },
	{ slug: 'aurora-titanium', name: 'Aurora Titanium', finish: 'Titânio · Reflexos azul-violeta', description: 'Titânio acetinado com uma placa iridescente que muda com a luz.', price: '$3,700', image: auroraTitanium, alt: 'Fones de titânio com placas azul-violeta iridescentes', status: 'Conceito' },
	{ slug: 'rose-gold-atelier', name: 'Rose Gold Atelier', finish: 'Ouro rosé · Resina fumê', description: 'Tons quentes, corpo translúcido e detalhes inspirados no trabalho artesanal.', price: '$4,200', image: roseGoldAtelier, alt: 'Fones em ouro rosé sobre veludo bordô', status: 'Conceito' },
	{ slug: 'carbon-nocturne', name: 'Carbon Nocturne', finish: 'Fibra de carbono · Cobre', description: 'Textura de carbono forjado com um ponto de cobre sobre acabamento preto.', price: '$2,900', image: carbonNocturne, alt: 'Fones pretos com placas de fibra de carbono e detalhe em cobre', status: 'Conceito' },
	{ slug: 'sapphire-signature', name: 'Sapphire Signature', finish: 'Safira · Prata polida', description: 'Azul profundo e prata em uma composição de brilho frio e acabamento preciso.', price: '$3,600', image: sapphireSignature, alt: 'Fones com placas azuis e contorno de prata', status: 'Conceito' },
	{ slug: 'copper-resonance', name: 'Copper Resonance', finish: 'Cobre escovado · Resina fumê', description: 'Cobre escovado e transparência escura em uma edição de presença acolhedora.', price: '$3,400', image: copperResonance, alt: 'Fones com placas de cobre escovado e corpo translúcido', status: 'Conceito' },
	{ slug: 'pearl-edition', name: 'Pearl Édition', finish: 'Madrepérola · Ouro champanhe', description: 'Reflexos perolados e contorno dourado em uma edição de brilho delicado.', price: '$4,800', image: pearlEdition, alt: 'Fones com placas de madrepérola e acabamento dourado', status: 'Conceito' },
];
