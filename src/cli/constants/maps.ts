const fileMap = new Map();
const importMap = new Map<string, string[]>();

export const setFileMap = (key: string, value: string): void => {
    fileMap.set(key.replace(/\\/g, '/'), value.replace(/\\/g, '/'));
};

export const getFileMap = (key?: string): string | Map<string, string> =>
    key ? fileMap.get(key) || '' : fileMap;

export const setImportMap = (key: string, value: string[]): void => {
    importMap.set(key.replace(/\\/g, '/'), value.map(v => v.replace(/\\/g, '/')));
};

export const getImportMap = (key?: string): string[] | Map<string, string[]> =>
    key ? importMap.get(key) || [] : importMap;

export const annotationMap: { [key: string]: string } = {
    'client_controller': 'cubix/client/controllers',
    'client_service': 'cubix/client/services',
    'client_component': 'cubix/client/components',
    'ui_component': 'cubix/client/ui',
    'client_inputs': 'cubix/client/inputs',
    'event_listeners': 'cubix/client/eventListeners',
    'server_controller': 'cubix/server/controllers',
    'server_service': 'cubix/server/services',
    'server_component': 'cubix/server/components',
    'event_handlers': 'cubix/server/eventHandlers',
    'shared_service': 'cubix/shared/services',
    'shared_constants': 'cubix/shared/constants',
    'shared_types': 'cubix/shared/types',
    'shared_utils': 'cubix/shared/utils'
};

