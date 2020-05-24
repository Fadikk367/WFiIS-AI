import json
from math import inf

def get_closest_vertex(result):
    unvisited = [{"name": vertex, "distance": details['distance']} for vertex, details in  result.items() if not details['visited']]
    print(unvisited)
    closest = unvisited[0]

    for i in range(1, len(unvisited) - 1):
        if unvisited[i]['distance'] < closest['distance']:
            closest = unvisited[i]

    return closest['name']



def shortest_path(graph, start_vertex):
    result = {}
    visited = []
    unvisited = []
    for vertex in graph:
        result[vertex] = {'distance': inf, 'previous': None, 'visited': False}
        unvisited.append(vertex)

    result[start_vertex]['distance'] = 0
  
    not_empty = True

    while not_empty:
        print(not_empty)
        current = get_closest_vertex(result)

        result[current]['visited'] = True

        for neighbour in graph[current]:
            dist = result[current]['distance'] + neighbour['distance']
            if dist < result[neighbour['name']]['distance']:
                result[neighbour['name']]['distance'] = dist
                result[neighbour['name']]['previous'] = current
            
        not_empty = any([not result[vertex]['visited'] for vertex in result])

    for item in result:
        print(f"{item}: {result[item]}")



        
            


graph = {}


with open('cities.json', 'r') as f:
    data = json.load(f)

    for item in data:
        graph[item['name']] = item['neighbours']


shortest_path(graph, "Arad")

