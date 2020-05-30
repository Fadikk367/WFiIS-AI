import json
from math import inf

def load_graph_from_json(filename):
    with open(filename, 'r') as f:
        data = json.load(f)

    graph = {}
    for item in data:
        graph[item['name']] = item['neighbours']

    return graph


def get_closest_vertex(result):
    unvisited = [{"name": vertex, "distance": details['distance']} for vertex, details in  result.items() if not details['visited']]

    closest = unvisited[0]
    for i in range(1, len(unvisited) - 1):
        if unvisited[i]['distance'] < closest['distance']:
            closest = unvisited[i]

    return closest['name']


def shortest_path(graph, start_vertex):
    result = {}
    for vertex in graph:
        result[vertex] = {'distance': inf, 'previous': None, 'visited': False}


    result[start_vertex]['distance'] = 0
  
    not_empty = True

    while not_empty:
        current = get_closest_vertex(result)
        result[current]['visited'] = True

        for neighbour in graph[current]:
            dist = result[current]['distance'] + neighbour['distance']
            if dist < result[neighbour['name']]['distance']:
                result[neighbour['name']]['distance'] = dist
                result[neighbour['name']]['previous'] = current
            
        not_empty = any([not result[vertex]['visited'] for vertex in result])

    return result


def get_path_as_string(result, start, destination):
    path = []
    current = destination
    while current != start:
        section = {
            'distance': result[current]['distance'] - result[result[current]['previous']]['distance'],
            'name': current
        }
        path.insert(0, section)
        current = result[current]['previous']

    path_str = f'{start} '
    for section in path:
        path_str += f'=> {section["name"]}({section["distance"]}km) '
    path_str += f'; total: {result[destination]["distance"]}km'

    return path_str

    

if __name__ == '__main__':
    graph = load_graph_from_json('cities.json')
    result = shortest_path(graph, start_vertex="Arad")
    path = get_path_as_string(result, start="Arad", destination="Bucharest")
    print(path)

