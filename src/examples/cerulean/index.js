import style from './style.json'

export default {
  id: 'greenland-ice-thickness',
  name: 'Greenland Ice Thickness',
  format: 'fgb',
  dataUrl: 'https://workspace-ui-public.cif.gtif.eox.at/api/public/share/public-4WaZei3Y-02/examples/202501200900_SouthEast_RIC-processed.fgb',
  style,
  layers: [
    {
      type: 'Vector',
      properties: {
        id: 'FgbLayer',
        title: 'Vector Data',
      },
      source: {
        type: 'FlatGeoBuf',
        url: 'https://workspace-ui-public.cif.gtif.eox.at/api/public/share/public-4WaZei3Y-02/examples/202501200900_SouthEast_RIC-processed.fgb',
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
