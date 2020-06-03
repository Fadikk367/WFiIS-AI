import xml.etree.ElementTree as ET
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.cluster import KMeans
from sklearn.decomposition import PCA


tree = ET.parse('dataset_publications.xml')
root = tree.getroot()

documents = []

print(len(root))

for record in root:
    doc = {}

    record = record[0]
    
    # doc['date'] = record.attrib['mdate']
    # doc['key'] = record.attrib['key']

    # doc['authors'] = [el.text for el in record.findall('author')]
    # doc['editors'] = [el.text for el in record.findall('editors')]
    authors = [el.text for el in record.findall('author')]
    editors = [el.text for el in record.findall('editors')]
    doc['contributors_number'] = len(authors) + len(editors)

    try:
        doc['year'] = int(record.find('year').text)
    except AttributeError:
        pass

    try:
        pages = record.find('pages').text
        separator = pages.find('-')
        doc['pages'] =  int(pages[separator+1:]) - int(pages[:separator])

    except AttributeError:
        continue
    except ValueError:
        continue
        

    # try:
    #     doc['title'] = record.find('title').text
    # except AttributeError:
    #     pass

    # try:
    #     doc['volume'] = record.find('volume').text
    # except AttributeError:
    #     pass

    # try:
    #     doc['publisher'] = record.find('publisher').text
    # except AttributeError:
    #     pass

    # try:
    #     doc['journal'] = record.find('journal').text
    # except AttributeError:
    #     pass

    documents.append(doc)


pages = []
contributors = []
years = []

for item in documents:
    if item['pages'] > 1000: continue
    pages.append(item['pages'])
    contributors.append(item['contributors_number'])
    years.append(item['year'])


df_1 =  pd.DataFrame(data={'pages': pages, 'contributors': contributors})
df_2 =  pd.DataFrame(data={'years': years, 'contributors': contributors})
df_3 =  pd.DataFrame(data={'pages': pages, 'yeas': years})
data_frames = [df_1, df_2, df_3]

df = pd.DataFrame(data={'contributors': contributors, 'pages': pages, 'years': years})
print()
print(df.head())
print()


distortions = []
for i in range(1, 21):
    KM = KMeans(n_clusters=i, random_state=0).fit(df)
    distortions.append(KM.inertia_)

plt.figure(1)
plt.subplot(221)
plt.plot([i for i in range(1, 21)], distortions)
plt.xlabel('clusters number')
plt.ylabel('distortion')

pca = PCA()
pca_data = pca.fit_transform(df)
print("\nPCA decompositions ratios:")
print(pca.explained_variance_ratio_)
print("\n\n")


for i, df in enumerate(data_frames):

    kmeans = KMeans(n_clusters=3, random_state=0).fit(df)
    labels = kmeans.labels_
    centers = kmeans.cluster_centers_
    print(f'<===== DataFrame{i} =====>')
    print('centers:')
    print(centers)
    print()


    data = df.values

    x_min, x_max = data[:, 0].min() - 1, data[:, 0].max() + 1
    y_min, y_max = data[:, 1].min() - 1, data[:, 1].max() + 1

    h = 0.2 
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h), np.arange(y_min, y_max, h))

    z = kmeans.predict(np.c_[xx.ravel(), yy.ravel()])
    z = z.reshape(xx.shape)

    plt.subplot(222+i)
    plt.imshow(
        z, 
        interpolation='nearest',
        extent=(xx.min(), xx.max(), yy.min(), yy.max()),
        aspect='auto', 
        origin='lower'
        
    )

    plt.plot(data[:, 0], data[:, 1], 'r.', markersize=5)
    plt.xlabel(df.columns[0])
    plt.ylabel(df.columns[1])

plt.show()




