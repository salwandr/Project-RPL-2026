
install.packages(c("ggplot2", "factoextra", "FactoMineR", "readr"))

library(ggplot2)
library(factoextra)
library(FactoMineR)
library(readr)

data_water <- read.csv("water_potability.csv")

# Pembersihan Data
data_clean <- na.omit(data_water)

# Pengambilan Sampel (150 Baris) [cite: 36, 142]
set.seed(123) 
sample_data <- data_clean[sample(nrow(data_clean), 150), ]


fitur <- c("ph", "Hardness", "Solids", "Chloramines", "Sulfate", 
           "Conductivity", "Organic_carbon", "Trihalomethanes", "Turbidity")
sample_data.active <- sample_data[, fitur]

#Melakukan PCA [cite: 47, 50, 192, 193]
hasil_pca <- prcomp(sample_data.active, scale = TRUE)

#Visualisasi Biplot [cite: 57, 58, 197-201]
fviz_pca_biplot(hasil_pca, 
                repel = TRUE,            
                col.var = "#CE2963",    
                col.ind = "#265B96",     
                title = "Analisis Biplot Kualitas Air")
                