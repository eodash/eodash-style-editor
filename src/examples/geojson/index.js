import style from './style.json'

export default {
  id: 'africa',
  name: 'Countries of Africa',
  format: 'geojson',
  dataUrl:
    'https://gist.github.com/1310aditya/35b939f63d9bf7fbafb0ab28eb878388/raw/96b48425262b64764254745393ba63456fe3135d/africa.json',
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
        url: 'https://gist.github.com/1310aditya/35b939f63d9bf7fbafb0ab28eb878388/raw/96b48425262b64764254745393ba63456fe3135d/africa.json',
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
