import style from './style.json'

export default {
  id: 'africa',
  name: 'Countries of Africa',
  format: 'geojson',
  dataUrl: '/eodash-style-editor/data/geojson/africa.json',
  style,
  layers: [
    {
      type: 'Vector',
      properties: {
        id: 'GeoJSONLayer',
        title: 'Countries of Africa',
      },
      source: {
        type: 'Vector',
        format: 'GeoJSON',
        url: '/eodash-style-editor/data/geojson/africa.json',
      },
      style,
      interactions: [
        {
          type: 'select',
          options: {
            id: 'selectInteraction',
            condition: 'pointermove',
            style: {
              'stroke-color': 'white',
              'stroke-width': 3,
            },
          },
        },
      ],
    },
  ],
}
