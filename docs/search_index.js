var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "Home",
    "title": "Home",
    "category": "page",
    "text": ""
},

{
    "location": "#ChemometricsTools.jl-1",
    "page": "Home",
    "title": "ChemometricsTools.jl",
    "category": "section",
    "text": "A Chemometrics Suite for Julia.This package offers access to essential chemometrics methods in a convenient and reliable way. It is a lightweight library written for performance and longevity. That being said, it\'s still a bit of a work in progress and if you find any bugs please make an issue!"
},

{
    "location": "#Installation:-1",
    "page": "Home",
    "title": "Installation:",
    "category": "section",
    "text": "using Pkg\nPkg.add(\"ChemometricsTools\")"
},

{
    "location": "#Support:-1",
    "page": "Home",
    "title": "Support:",
    "category": "section",
    "text": "This package was written in Julia 1.0 but should run fine in 1.1 or later releases. That\'s the beauty of from scratch code with minimal dependencies."
},

{
    "location": "#Ethos-1",
    "page": "Home",
    "title": "Ethos",
    "category": "section",
    "text": "Dependencies: Only base libraries (LinearAlgebra, StatsBase, Statistics, Plots) etc will be required. This is for longevity, and to provide a fast precompilation time. As wonderful as it is that other packages exist to do some of the internal operations this one needs, we won\'t have to worry about a breaking change made by an external author working out the kinks in a separate package. I want this to be long-term reliable without much upkeep. I\'m a busy guy working a day job; I write this to warm-up before work, and unwind afterwards.Arrays Only: In it\'s current state all of the algorithms available in this package operate exclusively on 1 or 2 Arrays. To be specific, the format of input arrays should be such that the number of rows are the observations, and the number of columns are the variables. This choice was made out of convenience and my personal bias. If enough users want DataFrames, Tables, JuliaDB formats, maybe this will change.Center-Scaling: None of the methods in this package will center and scale for you. This package won\'t waste your time deciding if it should auto-center/scale large chunks of data every-time you do a regression/classification."
},

{
    "location": "#Why-Julia?-1",
    "page": "Home",
    "title": "Why Julia?",
    "category": "section",
    "text": "In Julia we can do mathematics like R or Matlab (no installations/imports), but write glue code as easily as python, with the expressiveness of scala, with (often) the performance of C/C++. Multidispatch makes recycling code painless, and broadcasting allows for intuitive application of operations across collections. I\'m not a soft-ware engineer, but, these things have made Julia my language of choice. Try it for a week on Julia 1.0.3, if you don\'t get hooked, I\'d be surprised."
},

{
    "location": "Demos/Transforms/#",
    "page": "Transforms",
    "title": "Transforms",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/Transforms/#Transforms-Demo-1",
    "page": "Transforms",
    "title": "Transforms Demo",
    "category": "section",
    "text": "Two design choices introduced in this package are \"Transformations\" and \"Pipelines\". Transformations are the smallest unit of a \'pipeline\'. They are simply functions that have a deterministic inverse. For example if we mean center our data and store the mean vector, we can always invert the transform by adding the mean back to the data. That\'s effectively what transforms do, they provide to and from common data transformations used in chemometrics.Let\'s start with a trivial example with faux data where a random matrix of data is center scaled and divided by the standard deviation(StandardNormalVariate):FauxSpectra1 = randn(10,200);\nSNV = StandardNormalVariate(FauxSpectra1);\nTransformed1 = SNV(FauxSpectra1);As can be seen the application of the StandardNormalVariate() function returns an object that is used to transform future data by the data it was created from. This object can be applied to new data as follows,FauxSpectra2 = randn(10,200);\nTransformed2 = SNV(FauxSpectra2);Transformations can also be inverted (with-in numerical noise). For example,RMSE(FauxSpectra1, SNV(Transformed1; inverse = true)) < 1e-14\nRMSE(FauxSpectra2, SNV(Transformed2; inverse = true)) < 1e-14We can use transformations to treat data from multiple sources the same way. This helps mitigate user-error for cases where test data is scaled based on training data, calibration transfer, etc. Pipelines are a logical and convenient extension of transformations."
},

{
    "location": "Demos/Pipelines/#",
    "page": "Pipelines",
    "title": "Pipelines",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/Pipelines/#Pipelines-Demo-1",
    "page": "Pipelines",
    "title": "Pipelines Demo",
    "category": "section",
    "text": "Multiple Transformations can be easily chained together and stored using \"Pipelines\". Preprocessing methods, or really any univariate function may be included in a pipeline, but that will likely mean it can no longer be inverted. Pipelines are basically convenience functions, but are somewhat flexible and can be used for automated searches,PreprocessPipe = Pipeline(FauxSpectra1, RangeNorm, Center);\nProcessed = PreprocessPipe(FauxSpectra1);Of course pipelines of transforms can also be inverted,RMSE( FauxSpectra1, PreprocessPipe(Processed; inverse = true) ) < 1e-14Pipelines can also be created and executed as an \'in place\' operation for large datasets. This has the advantage that your data is transformed immediately without making copies in memory. This may be useful for large datasets and memory constrained environments. WARNING: be careful to only run the pipeline call or its inverse once! It is much safer to use the not inplace function outside of a REPL/script environment.FauxSpectra = randn(10,200);\nOriginalCopy = copy(FauxSpectra);\nInPlacePipe = PipelineInPlace(FauxSpectra, Center, Scale);See without returning the data or an extra function call we have transformed it according to the pipeline as it was instantiated...FauxSpectra == OriginalCopy\n#Inplace transform the data back\nInPlacePipe(FauxSpectra; inverse = true)\nRMSE( OriginalCopy, FauxSpectra ) < 1e-14Pipelines are kind of flexible. We can put nontransform (operations that cannot be inverted) preprocessing steps in them as well. In the example below the first derivative is applied to the data, this irreversibly removes a column from the data,PreprocessPipe = Pipeline(FauxSpectra1, FirstDerivative, RangeNorm, Center);\nProcessed = PreprocessPipe(FauxSpectra1);\n#This should be equivalent to the following...\nSpectraDeriv = FirstDerivative(FauxSpectra1);\nAlternative = Pipeline(SpectraDeriv , RangeNorm, Center);\nProcessed == Alternative(SpectraDeriv)Great right? Well what happens if we try to do the inverse of our pipeline with an irreversible function (First Derivative) in it?PreprocessPipe(Processed; inverse = true)Well we get an assertion error."
},

{
    "location": "Demos/Pipelines/#Automated-Pipeline-Example-1",
    "page": "Pipelines",
    "title": "Automated Pipeline Example",
    "category": "section",
    "text": "We can take advantage of how pipelines are created; at their core they are tuples of transforms/functions. So if we can make an array of transforms and set some conditions they can be stored and applied to unseen data. A fun example of an automated transform pipeline is in the whimsical paper written by Willem Windig et. al. That paper is called \'Loopy Multiplicative Scatter Transform\'. Below I\'ll show how we can implement that algorithm here (or anything similar) with ease. Loopy MSC: A Simple Way to Improve Multiplicative Scatter Correction. Willem Windig, Jeremy Shaver, Rasmus Bro. Applied Spectroscopy. 2008. Vol 62, issue: 10, 1153-1159First let\'s look at the classic Diesel data before applying Loopy MSC (Image: rawspectra)Alright, there is scatter, let\'s go for it,RealSpectra = convert(Array, CSV.read(\"/diesel_spectra.csv\"));\nCurrent = RealSpectra;\nLast = zeros(size(Current));\nTransformArray = [];\nwhile RMSE(Last, Current) > 1e-5\n    if any(isnan.(Current))\n        break\n    else\n        push!(TransformArray, MultiplicativeScatterCorrection( Current ) )\n        Last = Current\n        Current = TransformArray[end](Last)\n    end\nend\n#Now we can make a pipeline object from the array of stored transforms\nLoopyPipe = Pipeline( Tuple( TransformArray ) );For a sanity check we can ensure the output of the algorithm  is the same as the new pipeline so it can be applied to new data.Current == LoopyPipe(RealSpectra)Looks like our automation driven pipeline is equivalent to the loop it took to make it. More importantly did we remove scatter after 3 automated iterations of MSC? (Image: loopymsc)Yes, yes we did. Pretty easy right?"
},

{
    "location": "Demos/ClassificationExample/#",
    "page": "Classification",
    "title": "Classification",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/ClassificationExample/#Classification-Demo:-1",
    "page": "Classification",
    "title": "Classification Demo:",
    "category": "section",
    "text": "This demo shows an applied solution to a classification problem using real mid-infrared data. If you want to see the gambit of methods included in ChemometricsTools check the classification shootout example. There\'s also a bunch of tools for changes of basis such as: principal components analysis, linear discriminant analysis, orthogonal signal correction, etc. With those kinds of tools we can reduce the dimensions of our data and make classes more separable. So separable that trivial classification methods like a Gaussian discriminant can get us pretty good results. Below is an example analysis performed on mid-infrared spectra of strawberry purees and adulterated strawberry purees (yes fraudulent food items are a common concern).(Image: Raw)Use of Fourier transform infrared spectroscopy and partial least squares regression for the detection of adulteration of strawberry purées. J K Holland, E K Kemsley, R H Wilsonsnv = StandardNormalVariate(Train);\nTrain_pca = PCA(snv(Train);; Factors = 15);\n\nEnc = LabelEncoding(TrnLbl);\nHot = ColdToHot(TrnLbl, Enc);\n\nlda = LDA(Train_pca.Scores , Hot);\nclassifier = GaussianDiscriminant(lda, TrainS, Hot)\nTrainPreds = classifier(TrainS; Factors = 2);(Image: LDA of PCA)Cool right? Well, we can now apply the same transformations to the test set and pull some multivariate Gaussians over the train set classes to see how we do identifying fraudulent puree\'s,TestSet = Train_pca(snv(Test));\nTestSet = lda(TestSet);\nTestPreds = classifier(TestS; Factors  = 2);\nMulticlassStats(TestPreds .- 1, TstLbl , Enc)If you\'re following along you\'ll get a ~92% F-measure depending on your random split. Not bad. You may also notice this package has a nice collection of performance metrics for classification on board. Anyways, I\'ve gotten 100%\'s with more advanced methods but this is a cute way to show off some of the tools currently available."
},

{
    "location": "Demos/RegressionExample/#",
    "page": "Regression",
    "title": "Regression",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/RegressionExample/#Regression/Training-Demo:-1",
    "page": "Regression",
    "title": "Regression/Training Demo:",
    "category": "section",
    "text": "This demo shows a few ways to build a PLS regression model and perform cross validation. If you want to see the gambit of regression methods included in ChemometricsTools check the regression shootout example.There are a few built-in\'s to make training models a snap. Philosophically I decided, that making wrapper functions to perform Cross Validation is not fair to the end-user. There are many cases where we want specialized CV\'s but we don\'t want to write nested for-loops that run for hours then debug them... Similarly, most people don\'t want to spend their time hacking into rigid GridSearch objects, or scouring stack exchange / package documentation. Especially when it\'d be easier to write an equivalent approach that is self documenting from scratch. Instead, I used Julia\'s iterators to make K-Fold validations convenient, below is an example Partial Least Squares Regression CV.#Split our data into two parts one 70% one 30%\n((TrainX,TrainY),(TestX, TestY)) = SplitByProportion(x, yprop, 0.7);\n#Preprocess it\nMSC_Obj = MultiplicativeScatterCorrection(TrainX);\nTrainX = MSC_Obj(TrainX);\nTestX = MSC_Obj(TestX);\n#Begin CV!\nLatentVariables = 22\nErr = repeat([0.0], LatentVariables);\n#Note this is the Julian way to nest two loops\nfor Lv in 1:LatentVariables, (Fold, HoldOut) in KFoldsValidation(20, TrainX, TrainY)\n    PLSR = PartialLeastSquares(Fold[1], Fold[2]; Factors = Lv)\n    Err[Lv] += SSE( PLSR(HoldOut[1]), HoldOut[2] )\nend\nscatter(Err, xlabel = \"Latent Variables\", ylabel = \"Cumulative SSE\", labels = [\"Error\"])\nBestLV = argmin(Err)\nPLSR = PartialLeastSquares(TrainX, TrainY; Factors = BestLV)\nRMSE( PLSR(TestX), TestY )(Image: 20folds)That\'s great right? but, hey that was kind of slow. Knowing what we know about ALS based models, we can do the same operation in linear time with respect to latent factors by computing the most latent variables first and only recomputing the regression coefficients. An example of this is below,Err = repeat([0.0], 22);\nModels = []\nfor Lv in 22:-1:1\n    for ( i, ( Fold, HoldOut ) ) in enumerate(KFoldsValidation(20, TrainX, TrainY))\n        if Lv == 22\n            push!( Models, PartialLeastSquares(Fold[1], Fold[2]; Factors = Lv) )\n        end\n        Err[Lv] += SSE( Models[i]( HoldOut[1]; Factors = Lv), HoldOut[2] )\n    end\nendThis approach is ~5 times faster on a single core( < 2 seconds), pours through 7Gb less data, and makes 1/5th the allocations (on this dataset at least). If you wanted you could distribute the inner loop (using Distributed.jl) and see drastic speed ups!"
},

{
    "location": "Demos/SIPLS/#",
    "page": "SIPLS",
    "title": "SIPLS",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/SIPLS/#Stacked-Interval-Partial-Least-Squares-1",
    "page": "SIPLS",
    "title": "Stacked Interval Partial Least Squares",
    "category": "section",
    "text": "Here\'s a post I kind of debated making... I once read a paper stating that SIPLS was \"too complicated\" to implement, and used that as an argument to favor other methods. SIPLS is actually pretty simple, highly effective, and it has statistical guarantees. What\'s complicated about SIPLS is providing it to end-users without shielding them from the internals, or leaving them with a pile of hard to read low level code. I decided, the way to go for \'advanced\' methods, is to just provide convenience functions. Make life easier for an end-user that knows what they are doing. Demo\'s are for helping ferry people along and showing at least one way to do things, but there\'s no golden ticket one-line generic code-base here. Providing it, would be a mistake to people who would actually rely on using this sort of method."
},

{
    "location": "Demos/SIPLS/#Steps-to-SIPLS-1",
    "page": "SIPLS",
    "title": "4-Steps to SIPLS",
    "category": "section",
    "text": "Break the spectra\'s columnspace into invervals (the size can be CV\'d but below I just picked one), then we CV PLS models inside each interval.\nOn a hold out set(or via pooling), we find the prediction error of our intervals\nThose errors are then reciprocally weighted\nApply those weights to future predictions via multiplication and sum the result of each interval model."
},

{
    "location": "Demos/SIPLS/#.-Crossvalidate-the-interval-models-1",
    "page": "SIPLS",
    "title": "1. Crossvalidate the interval models",
    "category": "section",
    "text": "MaxLvs = 10\nCVModels = []\nCVErr = []\nIntervals = MakeIntervals( size(calib1)[2], 30 );\nfor interval in Intervals\n    IntervalError = repeat([0.0], MaxLvs);\n    Models = []\n\n    for Lv in MaxLvs:-1:1\n        for ( i, ( Fold, HoldOut ) ) in enumerate(KFoldsValidation(10, calib1, caliby))\n            if Lv == MaxLvs\n                KFoldModel = PartialLeastSquares(Fold[1][:,interval], Fold[2]; Factors = Lv)\n                push!( Models, KFoldModel )\n            end\n\n            Predictions = Models[i]( HoldOut[1][:, interval]; Factors = Lv)\n            IntervalError[Lv] += SSE( Predictions, HoldOut[2])\n        end\n    end\n    OptimalLv = argmin(IntervalError)\n    push!(CVModels, PartialLeastSquares(calib1[:, interval], caliby; Factors = OptimalLv) )\n    push!(CVErr,    IntervalError[OptimalLv] )\nendFor fun, we can view the weights of each intervals relative error on the CV\'d spectra with this lovely convenience function,IntervalOverlay(calib1, Intervals, CVErr)(Image: CVERR)"
},

{
    "location": "Demos/SIPLS/#.-Validate-1",
    "page": "SIPLS",
    "title": "2. Validate",
    "category": "section",
    "text": "VErr = []\nIntervalError = repeat([0.0], MaxLvs);\nfor (model, interval) in enumerate(Intervals)\n    push!(VErr, SSE( CVModels[model](valid1[:,interval]), validy) )\nend"
},

{
    "location": "Demos/SIPLS/#.-Make-reciprocal-weights-1",
    "page": "SIPLS",
    "title": "3. Make reciprocal weights",
    "category": "section",
    "text": "StackedWeights = stackedweights(VErr);We can recycle that same plot recipe to observe what this weighting function does for us. After calling the stacked weights function we can see how much each interval will contribute to our additve model. In essence, the weights make the intervals with lower error contribute more to the final stacked model, (Image: OS)"
},

{
    "location": "Demos/SIPLS/#.-Pool-predictions-on-test-set-and-weight-results-1",
    "page": "SIPLS",
    "title": "4. Pool predictions on test set and weight results",
    "category": "section",
    "text": "Results = zeros(size(tst1)[1]);\nfor (model, interval) in enumerate(Intervals)\n    Results += CVModels[model](tst1[:,interval]) .* StackedWeights[model]\nend\n\nRMSE( Results, tsty)> 4.09The RMSE from the SIPLS model is ~0.6 units less then that which we can observe from the same dataset using base PLSR in my Calibration Transfer Demo. This is actually really fast to run too. Every line in this script (aside from importing CSV) runs in roughly ~1-2 seconds."
},

{
    "location": "Demos/CalibXfer/#",
    "page": "Calibration Transfer",
    "title": "Calibration Transfer",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/CalibXfer/#Direct-Standardization-Demo-1",
    "page": "Calibration Transfer",
    "title": "Direct Standardization Demo",
    "category": "section",
    "text": "The point of this demo is to basically show off that ChemometricsTools contains some base methods for Calibration Transfer. If you don\'t know what that is, it\'s basically the subset of Chemometrics that focuses on transfer learning data collected on one instrument to another. This saves time and money for instruments that need to be calibrated but perform routine analysis\'.This demo uses the 2002 pharmaceutical shoot-out data and predicts upon the first property value(pretty sure its API content). The dataset contains the same samples of an unstated pharmaceutical measured on two spectrometers with experimentally determined property values. Our goal will be to use one model but adapt the domain from one of the spectrometers to the other.First let\'s look at our linear sources of variation to get a feel for the data,pca = PCA(calib1; Factors = 20);\nplot(cumsum(ExplainedVariance(pca)), title = \"Scree plot\", xlabel = \"PC\'s\", ylabel = \"Variance Explained\")(Image: scree)Yea so this isn\'t a true Scree plot, but it has the same information...Looks like after ~5 factors we have garbage w.r.t X decompositions, good to know. So I\'d venture to guess a maximum of 15 Latent Variables for a PLS-1 regression is more than a good enough cut-off for cross-validaiton.MaxLvs = 15\nErr = repeat([0.0], MaxLvs);\nModels = []\nfor Lv in MaxLvs:-1:1\n    for ( i, ( Fold, HoldOut ) ) in enumerate(KFoldsValidation(10, calib1, caliby))\n        if Lv == MaxLvs\n            push!( Models, PartialLeastSquares(Fold[1], Fold[2]; Factors = Lv) )\n        end\n        Err[Lv] += SSE( Models[i]( HoldOut[1]; Factors = Lv), HoldOut[2] )\n    end\nend\n\nscatter(Err, xlabel = \"Latent Variables\", ylabel = \"Cumulative SSE\", labels = [\"Error\"])(Image: cv)Great looks like we can get by with 5-8 LV\'s. Let\'s fine tune our Latent Variables based on the hold out set to make our final PLSR model.PLSR1 = PartialLeastSquares(calib1, caliby; Factors = 8);\nfor vLv in 5:8\n    println(\"LV: \", vLv)\n    println(\"RMSEV: \", RMSE(PLSR1(valid1; Factors = vLv), validy))\nendKind of hacky, but it works fine for a demo, we see that 7 factors is optimal on the hold out set so that\'s what we\'ll use from here on,println(\"RMSEP: \", RMSE(PLSR1(tst1; Factors = 7), tsty))> RMSEP: 4.76860402876937"
},

{
    "location": "Demos/CalibXfer/#Getting-to-the-point-1",
    "page": "Calibration Transfer",
    "title": "Getting to the point",
    "category": "section",
    "text": "So why do we need to do a calibration transfer? Same chemical, same type of measurements, even the same wavelengths are recorded and compared. Do the naive thing, apply this model to the measurements on instrument 2. See what error you get.println(\"RMSEP: \", RMSE(PLSR1(tst2; Factors = 7), tsty))>RMSEP: 10.303430504546292The prediction error is about 2 fold, in this case it\'d be hard to argue this is a useful model at all. Especially if you check the residuals. It\'s pretty clear the contributions of variance across multiple instruments are not the same in this case."
},

{
    "location": "Demos/CalibXfer/#Now-for-calibration-transfer!-1",
    "page": "Calibration Transfer",
    "title": "Now for calibration transfer!",
    "category": "section",
    "text": "So let\'s use DirectStandardization. First we\'ll find the optimal number of DirectStandardization Factors to include in our model. We can do that on our hold out set and this should be very fast because we have a hold out set, so we can do this with some inefficient code.Factors = 1:15\nErr = repeat([0.0], length(Factors));\nfor F in Factors\n    DS2to1 = DirectStandardization(calib1, calib2; Factors = F);\n    cds2to1 = DS2to1(valid2; Factors = F)\n    Err[F] = RMSE( PLSR1(cds2to1; Factors = 7), validy )\nend\nscatter(Err, title = \"Transfered Model Validation Error\", xlabel = \"Latent Factors\",\n        ylabel = \"RMSE\", labels = [\"Error\"])(Image: cv)OptimalDSFactor = argmin(Err)\nDS2to1 = DirectStandardization(calib1, calib2; Factors = OptimalDSFactor);\ntds2to1 = DS2to1(tst2; Factors = OptimalDSFactor);Looks like 8 Factors in the DS transfer is pretty good. Lets see how the transferred data compares on the prediction set using the same model,println(\"RMSEP: \", RMSE(PLSR1(tds2to1; Factors = 7), tsty))> RMSEP: 5.693023386113084Viola... So in conclusion we can transform the data from instrument 2 to be similar to that of instrument 1. The errors we see are effectively commensurate between the data sources with this transform, and without it the error is about 2x greater. Maybe the main point here is \"look ChemometricsTools has some calibration transfer methods and the tools included work\". OSC, TOP, CORAL, etc is also included."
},

{
    "location": "Demos/CurveResolution/#",
    "page": "Curve Resolution",
    "title": "Curve Resolution",
    "category": "page",
    "text": ""
},

{
    "location": "Demos/CurveResolution/#Curve-Resolution-Demo-1",
    "page": "Curve Resolution",
    "title": "Curve Resolution Demo",
    "category": "section",
    "text": "ChemometricsTools has some curve resolution methods baked in. So far NMF, SIMPLISMA, and MCR-ALS are included. If you aren\'t familiar with them, they are used to extract spectral and concentration estimates from unknown mixtures in chemical signals. Below is an example of spectra which are composed of signals from a mixture of a 3 components. I could write a volume analyzing this simple set, but this is just a show-case of some methods and how to call them, what kind of results they might give you. The beauty of this example is that, we know what is in it, in a forensic or real-world situation we won\'t know what is in it, and we have to rely on domain knowledge, physical reasoning, and metrics to determine the validity of our results.Anyways, because we know, the pure spectra look like the following: (Image: pure)Note: There are three components (water, acetic acid, methanol), but their spectra were collected in duplicate.And the concentration profiles of the components follow the following simplex design, (Image: pureC)But the models we are using will only see the following (no pure components) (Image: impure)Raw = CSV.read(\"/triliq.csv\");\nMixture = collect(convert(Array, Raw)[:,1:end]);\npure = [10,11,20,21,28,29];\nPURE = Mixture[pure,:];\nimpure = [collect(1:9); collect(12:19);collect(22:27)];\nMixture = Mixture[impure,:];Great, so now let\'s run NMF, SIMPLISMA, and MCR-ALS with the SIMPLISMA estimates.( W_NMF, H_NMF ) = NMF(Mixture; Factors = 3, maxiters = 300, tolerance = 1e-8)\n(C_Simplisma,S_Simplisma, vars) = SIMPLISMA(Mixture; Factors = 18)\nvars\n#Find purest variables that are not neighbors with one another\ncuts = S_Simplisma[ [1,3,17], :];\n( C_MCRALS, S_MCRALS, err ) = MCRALS(Mixture, nothing, RangeNorm(cuts\')(cuts\')\';\n                                    Factors = 3, maxiters = 10,\n                                    norm = (true, false),\n                                    nonnegative = (true, true) )(Image: NMFS)(Image: SIMPLISMAS)(Image: MCRALSS)"
},

{
    "location": "Demos/CurveResolution/#Spectral-Recovery-Discussion-(Results-by-Eye):-1",
    "page": "Curve Resolution",
    "title": "Spectral Recovery Discussion (Results by Eye):",
    "category": "section",
    "text": "As we can see, NMF does resolve a few components that resemble a few of the actual pure components, but it really butchers the 3rd. While SIMPLISMA does a good job, at finding spectra that look \"real\" there are characteristics missing from the true spectra. It must be stated; SIMPLISMA wasn\'t invented for NIR signals. Finding pure variables in dozens... err... hundreds of over-lapping bands isn\'t really ideal. However, MCR-ALS quickly made work of those initial SIMPLISMA estimates and seems to have found some estimates that somewhat closely resemble the pure components."
},

{
    "location": "Demos/CurveResolution/#Concentration-Profile-Discussion-(Results-by-Eye):-1",
    "page": "Curve Resolution",
    "title": "Concentration Profile Discussion (Results by Eye):",
    "category": "section",
    "text": "(Image: NMFC)(Image: SIMPLISMAC)(Image: MCRALSC)SIMPLISMA basically botched this dataset with regards to the concentration profiles. While NMF and MCR-ALS do quite good. Of course preprocessing can help here, and tinkering too. Ultimately not bad, given the mixture components. I do have a paper that shows another approach to this problem doubtful I\'d be allowed to rewrite the code, I think my university owns it!Casey Kneale, Steven D. Brown, Band target entropy minimization and target partial least squares for spectral recovery and quantitation, Analytica Chimica Acta, Volume 1031, 2018, Pages 38-46, ISSN 0003-2670, https://doi.org/10.1016/j.aca.2018.07.054."
},

{
    "location": "man/Preprocess/#",
    "page": "Preprocessing",
    "title": "Preprocessing",
    "category": "page",
    "text": ""
},

{
    "location": "man/Preprocess/#Preprocessing-API-Reference-1",
    "page": "Preprocessing",
    "title": "Preprocessing API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Preprocess/#ChemometricsTools.CORAL-Tuple{Any,Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.CORAL",
    "category": "method",
    "text": "CORAL(X1, X2; lambda = 1.0)\n\nPerforms CORAL to facilitate covariance based transfer from X1 to X2 with regularization parameter lambda. Returns a CORAL object.\n\nCorrelation Alignment for Unsupervised Domain Adaptation. Baochen Sun, Jiashi Feng, Kate Saenko. https://arxiv.org/abs/1612.01939\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.CORAL-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.CORAL",
    "category": "method",
    "text": "(C::CORAL)(Z)\n\nApplies a the transform from a learned CORAL object to new data Z.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.MultiplicativeScatterCorrection-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.MultiplicativeScatterCorrection",
    "category": "method",
    "text": "(T::MultiplicativeScatterCorrection)(Z)\n\nApplies MultiplicativeScatterCorrection from a stored object T to Array Z.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.OrthogonalSignalCorrection-Tuple{Any,Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.OrthogonalSignalCorrection",
    "category": "method",
    "text": "OrthogonalSignalCorrection(X, Y; Factors = 1)\n\nPerforms Thomas Fearn\'s Orthogonal Signal Correction to an endogenous X and exogenous Y. The number of Factors are the number of orthogonal components to be removed from X. This function returns an OSC object.\n\nTom Fearn. On orthogonal signal correction. Chemometrics and Intelligent Laboratory Systems. Volume 50, Issue 1, 2000, Pages 47-52.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.OrthogonalSignalCorrection-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.OrthogonalSignalCorrection",
    "category": "method",
    "text": "(OSC::OrthogonalSignalCorrection)(Z; Factors = 2)\n\nApplies a the transform from a learned orthogonal signal correction object OSC to new data Z.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.TransferByOrthogonalProjection-Tuple{Any,Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.TransferByOrthogonalProjection",
    "category": "method",
    "text": "TransferByOrthogonalProjection(X1, X2; Factors = 1)\n\nPerforms Thomas Fearns Transfer By Orthogonal Projection to facilitate transfer from X1 to X2. Returns a TransferByOrthogonalProjection object.\n\nAnne Andrew, Tom Fearn. Transfer by orthogonal projection: making near-infrared calibrations robust to between-instrument variation. Chemometrics and Intelligent Laboratory Systems. Volume 72, Issue 1, 2004, Pages 51-56,\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.TransferByOrthogonalProjection-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.TransferByOrthogonalProjection",
    "category": "method",
    "text": "(TbOP::TransferByOrthogonalProjection)(X1; Factors = TbOP.Factors)\n\nApplies a the transform from a learned transfer by orthogonal projection object TbOP to new data X1.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.ALSSmoother-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.ALSSmoother",
    "category": "method",
    "text": "ALSSmoother(y; lambda = 100, p = 0.001, maxiters = 10)\n\nApplies an assymetric least squares smoothing function to a vector y. The lambda, p, and maxiters parameters control the smoothness. See the reference below for more information.\n\nPaul H. C. Eilers, Hans F.M. Boelens. Baseline Correction with Asymmetric Least Squares Smoothing.  2005\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.DirectStandardization-Tuple{Any,Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.DirectStandardization",
    "category": "method",
    "text": "DirectStandardization(InstrumentX1, InstrumentX2; Factors = minimum(collect(size(InstrumentX1))) - 1)\n\nMakes a DirectStandardization object to facilitate the transfer from Instrument #2 to Instrument #1 . The returned object can be used to transfer unseen data to the approximated space of instrument 1. The number of Factors used are those from the internal orthogonal basis.\n\nYongdong Wang and Bruce R. Kowalski, \"Calibration Transfer and Measurement Stability of Near-Infrared Spectrometers,\" Appl. Spectrosc. 46, 764-771 (1992)\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.FirstDerivative-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.FirstDerivative",
    "category": "method",
    "text": "FirstDerivative(X)\n\nUses the finite difference method to compute the first derivative for every row in X. Note: This operation results in the loss of a column dimension.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.FractionalDerivative",
    "page": "Preprocessing",
    "title": "ChemometricsTools.FractionalDerivative",
    "category": "function",
    "text": "FractionalDerivative(Y, X = 1 : length(Y); Order = 0.5)\n\nCalculates the Grunwald-Leitnikov fractional order derivative on every row of Array Y. Array X is a vector that has the spacing between column-wise entries in Y. X can be a scalar if that is constant (common in spectroscopy). Order is the fractional order of the derivative. Note: This operation results in the loss of a column dimension.\n\nThe Fractional Calculus, by Oldham, K.; and Spanier, J. Hardcover: 234 pages. Publisher: Academic Press, 1974. ISBN 0-12-525550-0\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.PerfectSmoother-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.PerfectSmoother",
    "category": "method",
    "text": "PerfectSmoother(y; lambda = 100)\n\nApplies an assymetric least squares smoothing function to a vector y. The lambda parameter controls the smoothness. See the reference below for more information.\n\nPaul H. C. Eilers. \"A Perfect Smoother\". Analytical Chemistry, 2003, 75 (14), pp 3631–3636.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.SavitzkyGolay-NTuple{4,Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.SavitzkyGolay",
    "category": "method",
    "text": "SavitzkyGolay(X, Delta, PolyOrder, windowsize)\n\nPerforms SavitskyGolay smoothing across every row in an Array X. The window size is the size of the convolution filter, PolyOrder is the order of the polynomial, and Delta is the order of the derivative.\n\nSavitzky, A.; Golay, M.J.E. (1964). \"Smoothing and Differentiation of Data by Simplified Least Squares Procedures\". Analytical Chemistry. 36 (8): 1627–39. doi:10.1021/ac60214a047.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.Scale1Norm-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.Scale1Norm",
    "category": "method",
    "text": "Scale1Norm(X)\n\nScales the columns of X by the 1-Norm of each row. Returns the scaled array.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.Scale2Norm-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.Scale2Norm",
    "category": "method",
    "text": "Scale2Norm(X)\n\nScales the columns of X by the 2-Norm of each row. Returns the scaled array.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.ScaleInfNorm-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.ScaleInfNorm",
    "category": "method",
    "text": "ScaleInfNorm(X)\n\nScales the columns of X by the Inf-Norm of each row. Returns the scaled array.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.SecondDerivative-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.SecondDerivative",
    "category": "method",
    "text": "FirstDerivative(X)\n\nUses the finite difference method to compute the second derivative for every row in X. Note: This operation results in the loss of two columns.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.StandardNormalVariate-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.StandardNormalVariate",
    "category": "method",
    "text": "StandardNormalVariate(X)\n\nScales the columns of X by the mean and standard deviation of each row. Returns the scaled array.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.offsetToZero-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.offsetToZero",
    "category": "method",
    "text": "offsetToZero(X)\n\nEnsures that no observation(row) of Array X is less than zero, by ensuring the minimum value of each row is zero.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.DirectStandardizationXform-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.DirectStandardizationXform",
    "category": "method",
    "text": "(DSX::DirectStandardizationXform)(X; Factors = length(DSX.pca.Values))\n\nApplies a the transform from a learned direct standardization object DSX to new data X.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.ScaleMinMax-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.ScaleMinMax",
    "category": "method",
    "text": "ScaleMinMax(X)\n\nScales the columns of X by the Min and Max of each row such that no observation is greater than 1 or less than zero. Returns the scaled array.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#ChemometricsTools.boxcar-Tuple{Any}",
    "page": "Preprocessing",
    "title": "ChemometricsTools.boxcar",
    "category": "method",
    "text": "boxcar(X; windowsize = 3, fn = mean)\n\nApplies a boxcar function (fn) to each window of size windowsize to every row in X.\n\n\n\n\n\n"
},

{
    "location": "man/Preprocess/#Functions-1",
    "page": "Preprocessing",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Preprocess.jl\"]"
},

{
    "location": "man/Transformations/#",
    "page": "Transformations/Pipelines",
    "title": "Transformations/Pipelines",
    "category": "page",
    "text": ""
},

{
    "location": "man/Transformations/#Transformations/Pipelines-API-Reference-1",
    "page": "Transformations/Pipelines",
    "title": "Transformations/Pipelines API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Transformations/#ChemometricsTools.Center-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.Center",
    "category": "method",
    "text": "(T::Center)(Z; inverse = false)\n\nCenters data in array Z column-wise according to learned mean centers in Center object T.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.CenterScale-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.CenterScale",
    "category": "method",
    "text": "(T::CenterScale)(Z; inverse = false)\n\nCenters and Scales data in array Z column-wise according to learned measures of central tendancy in Scale object T.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.QuantileTrim",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.QuantileTrim",
    "category": "type",
    "text": "(T::QuantileTrim)(X, inverse = false)\n\nTrims data in array X columns wise according to learned quantiles in QuantileTrim object T This function does NOT have an inverse.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.QuantileTrim-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.QuantileTrim",
    "category": "method",
    "text": "QuantileTrim(Z; quantiles::Tuple{Float64,Float64} = (0.05, 0.95) )\n\nTrims values above or below the specified columnwise quantiles to the quantile values themselves.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.RangeNorm-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.RangeNorm",
    "category": "method",
    "text": "(T::RangeNorm)(Z; inverse = false)\n\nScales and shifts data in array Z column-wise according to learned min-maxes in RangeNorm object T.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.Scale-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.Scale",
    "category": "method",
    "text": "(T::Scale)(Z; inverse = false)\n\nScales data in array Z column-wise according to learned standard deviations in Scale object T.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.Logit-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.Logit",
    "category": "method",
    "text": "Logit(Z; inverse = false)\n\nLogit transforms (ln( X / (1 - X) ))) every element in Z. The inverse may also be applied. Warning: This can return Infs and NaNs if elements of Z are not suited to the transform\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.Pipeline-Tuple{Any,Vararg{Any,N} where N}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.Pipeline",
    "category": "method",
    "text": "Pipeline( X, FnStack... )\n\nConstruct a pipeline object from vector/tuple of Transforms. The Transforms vector are effectively a vector of functions which transform data.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.Pipeline-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.Pipeline",
    "category": "method",
    "text": "Pipeline(Transforms)\n\nConstructs a transformation pipeline from vector/tuple of Transforms. The Transforms vector are effectively a vector of functions which transform data.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.PipelineInPlace-Tuple{Any,Vararg{Any,N} where N}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.PipelineInPlace",
    "category": "method",
    "text": "PipelineInPlace( X, FnStack...)\n\nConstruct a pipeline object from vector/tuple of Transforms. The Transforms vector are effectively a vector of functions which transform data. This function makes \"inplace\" changes to the Array X as though it has been sent through the pipeline. This is more efficient if memory is a concern, but can irreversibly transform data in memory depending on the transforms in the pipeline.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#ChemometricsTools.pipeline-Tuple{Any}",
    "page": "Transformations/Pipelines",
    "title": "ChemometricsTools.pipeline",
    "category": "method",
    "text": "(P::pipeline)(X; inverse = false)\n\nApplies the stored transformations in a pipeline object P to data in X. The inverse flag can allow for the transformations to be reversed provided they are invertible functions.\n\n\n\n\n\n"
},

{
    "location": "man/Transformations/#Functions-1",
    "page": "Transformations/Pipelines",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Transformations.jl\"]"
},

{
    "location": "man/Sampling/#",
    "page": "Sampling",
    "title": "Sampling",
    "category": "page",
    "text": ""
},

{
    "location": "man/Sampling/#Sampling-API-Reference-1",
    "page": "Sampling",
    "title": "Sampling API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Sampling/#ChemometricsTools.KennardStone-Tuple{Any,Any}",
    "page": "Sampling",
    "title": "ChemometricsTools.KennardStone",
    "category": "method",
    "text": "KennardStone(X, TrainSamples; distance = \"euclidean\")\n\nReturns the indices of the Kennard-Stone sampled exemplars (E), and those not sampled (O) as a 2-Tuple (E, O).\n\nR. W. Kennard & L. A. Stone (1969) Computer Aided Design of Experiments, Technometrics, 111, 137-148, DOI: 10.1080/00401706.1969.10490666\n\n\n\n\n\n"
},

{
    "location": "man/Sampling/#ChemometricsTools.SplitByProportion",
    "page": "Sampling",
    "title": "ChemometricsTools.SplitByProportion",
    "category": "function",
    "text": "SplitByProportion(X::Array, Proportion::Float64 = 0.5)\n\nSplits X Array along the observations dimension into a 2-Tuple based on the Proportion. The form of the output is the following: ( X1, X2 )\n\n\n\n\n\n"
},

{
    "location": "man/Sampling/#ChemometricsTools.SplitByProportion",
    "page": "Sampling",
    "title": "ChemometricsTools.SplitByProportion",
    "category": "function",
    "text": "SplitByProportion(X::Array, Y::Array,Proportion::Float64 = 0.5)\n\nSplits an X and Associated Y Array along the observations dimension into a 2-Tuple of 2-Tuples based on the Proportion. The form of the output is the following: ( (X1, Y1), (X2, Y2) )\n\n\n\n\n\n"
},

{
    "location": "man/Sampling/#ChemometricsTools.VenetianBlinds-Tuple{Any,Any}",
    "page": "Sampling",
    "title": "ChemometricsTools.VenetianBlinds",
    "category": "method",
    "text": "VenetianBlinds(X,Y)\n\nSplits an X and associated Y Array along the observation dimension into a 2-Tuple of 2-Tuples based on the whether it is even or odd. The form of the output is the following: ( (X1,Y1), (X2, Y2) )\n\n\n\n\n\n"
},

{
    "location": "man/Sampling/#ChemometricsTools.VenetianBlinds-Tuple{Any}",
    "page": "Sampling",
    "title": "ChemometricsTools.VenetianBlinds",
    "category": "method",
    "text": "VenetianBlinds(X)\n\nSplits an X Array along the observations dimension into a 2-Tuple of 2-Tuples based on the whether it is even or odd. The form of the output is the following: ( X1, X2 )\n\n\n\n\n\n"
},

{
    "location": "man/Sampling/#Functions-1",
    "page": "Sampling",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Sampling.jl\"]"
},

{
    "location": "man/Training/#",
    "page": "Training",
    "title": "Training",
    "category": "page",
    "text": ""
},

{
    "location": "man/Training/#Training-API-Reference-1",
    "page": "Training",
    "title": "Training API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Training/#ChemometricsTools.KFoldsValidation-Tuple{Int64,Any,Any}",
    "page": "Training",
    "title": "ChemometricsTools.KFoldsValidation",
    "category": "method",
    "text": "KFoldsValidation(K::Int, x, y)\n\nReturns a KFoldsValidation iterator with K folds. Because it\'s an iterator it can be used in for loops, see the tutorials for pragmatic examples. The iterator returns a 2-Tuple of 2-Tuples which have the  following form: ((TrainX,TrainY),(ValidateX,ValidateY).\n\n\n\n\n\n"
},

{
    "location": "man/Training/#ChemometricsTools.Shuffle!-Tuple{Any,Any}",
    "page": "Training",
    "title": "ChemometricsTools.Shuffle!",
    "category": "method",
    "text": "Shuffle!( X, Y )\n\nShuffles the rows of the X and Y data without replacement in place. In place, means that this function alters the order of the data in memory and this function does not return anything.\n\n\n\n\n\n"
},

{
    "location": "man/Training/#ChemometricsTools.Shuffle-Tuple{Any,Any}",
    "page": "Training",
    "title": "ChemometricsTools.Shuffle",
    "category": "method",
    "text": "Shuffle( X, Y )\n\nShuffles the rows of the X and Y data without replacement. It returns a 2-Tuple of the shuffled set.\n\n\n\n\n\n"
},

{
    "location": "man/Training/#Functions-1",
    "page": "Training",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Training.jl\"]"
},

{
    "location": "man/TimeSeries/#",
    "page": "Time Series",
    "title": "Time Series",
    "category": "page",
    "text": ""
},

{
    "location": "man/TimeSeries/#Time-Series-API-Reference-1",
    "page": "Time Series",
    "title": "Time Series API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/TimeSeries/#ChemometricsTools.RollingWindow-Tuple{Int64,Int64,Int64}",
    "page": "Time Series",
    "title": "ChemometricsTools.RollingWindow",
    "category": "method",
    "text": "RollingWindow(samples::Int,windowsize::Int,skip::Int)\n\nCreates a RollingWindow iterator from a number of samples and a static windowsize where every iteration skip steps are skipped. The iterator can be used in for loops to iteratively return indices of a dynamic rolling window.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.RollingWindow-Tuple{Int64,Int64}",
    "page": "Time Series",
    "title": "ChemometricsTools.RollingWindow",
    "category": "method",
    "text": "RollingWindow(samples::Int,windowsize::Int)\n\nCreates a RollingWindow iterator from a number of samples and a static windowsize. The iterator can be used in for loops to iteratively return indices of a dynamic rolling window.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.EWMA-Tuple{Array,Float64}",
    "page": "Time Series",
    "title": "ChemometricsTools.EWMA",
    "category": "method",
    "text": "EWMA(Initial::Float64, Lambda::Float64) = ewma(Lambda, Initial, Initial, RunningVar(Initial))\n\nConstructs an exponentially weighted moving average object from an vector of scalar property values Initial and the decay parameter Lambda. This computes the running statistcs neccesary for creating the EWMA model using the interval provided and updates the center value to the mean of the provided values.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.EWMA-Tuple{Float64,Float64}",
    "page": "Time Series",
    "title": "ChemometricsTools.EWMA",
    "category": "method",
    "text": "EWMA(Initial::Float64, Lambda::Float64) = ewma(Lambda, Initial, Initial, RunningVar(Initial))\n\nConstructs an exponentially weighted moving average object from an initial scalar property value Initial and the decay parameter Lambda. This defaults the center value to be the initial value.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.Limits-Tuple{ChemometricsTools.ewma}",
    "page": "Time Series",
    "title": "ChemometricsTools.Limits",
    "category": "method",
    "text": "Limits(P::ewma; k = 3.0)\n\nThis function returns the upper and lower control limits with a k span of variance for an EWMA object P. \n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.Variance-Tuple{ChemometricsTools.ewma}",
    "page": "Time Series",
    "title": "ChemometricsTools.Variance",
    "category": "method",
    "text": "Variance(P::ewma)\n\nThis function returns the EWMA control variance.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.ewma-Tuple{Any}",
    "page": "Time Series",
    "title": "ChemometricsTools.ewma",
    "category": "method",
    "text": "EWMA(P::ewma)(New; train = true)\n\nProvides an EWMA score for a New scalar value. If train == true the model is updated to include this new value.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#ChemometricsTools.ChangeCenter-Tuple{ChemometricsTools.ewma,Float64}",
    "page": "Time Series",
    "title": "ChemometricsTools.ChangeCenter",
    "category": "method",
    "text": "ChangeCenter(P::ewma, new::Float64)\n\nThis is a convenience function to update the center of a P EWMA model, to a new scalar value.\n\n\n\n\n\n"
},

{
    "location": "man/TimeSeries/#Functions-1",
    "page": "Time Series",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"TimeSeries.jl\"]"
},

{
    "location": "man/RegressionModels/#",
    "page": "Regression Models",
    "title": "Regression Models",
    "category": "page",
    "text": ""
},

{
    "location": "man/RegressionModels/#Regression-Models-API-Reference-1",
    "page": "Regression Models",
    "title": "Regression Models API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/RegressionModels/#ChemometricsTools.ClassicLeastSquares-Tuple{Any,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.ClassicLeastSquares",
    "category": "method",
    "text": "ClassicLeastSquares( X, Y; Bias = false )\n\nMakes a ClassicLeastSquares regression model of the form Y = AX with or without a Bias term. Returns a CLS object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.ClassicLeastSquares-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.ClassicLeastSquares",
    "category": "method",
    "text": "(M::ClassicLeastSquares)(X)\n\nMakes an inference from X using a ClassicLeastSquares object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.LSSVM-Tuple{Any,Any,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.LSSVM",
    "category": "method",
    "text": "LSSVM( X, Y, Penalty; KernelParameter = 0.0, KernelType = \"linear\" )\n\nMakes a LSSVM model of the form Y = AK with a bias term using a user specified Kernel(\"Linear\", or \"Guassian\") and has an L2 Penalty. Returns a LSSVM Wrapper for a CLS object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.LSSVM-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.LSSVM",
    "category": "method",
    "text": "(M::LSSVM)(X)\n\nMakes an inference from X using a LSSVM object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.PartialLeastSquares-Tuple{Any,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.PartialLeastSquares",
    "category": "method",
    "text": "PartialLeastSquares( X, Y; Factors = minimum(size(X)) - 2, tolerance = 1e-8, maxiters = 200 )\n\nReturns a PartialLeastSquares regression model object from arrays X and Y.\n\nPARTIAL LEAST-SQUARES REGRESSION: A TUTORIAL PAUL GELADI and BRUCE R.KOWALSKI. Analytica Chimica Acta, 186, (1986) PARTIAL LEAST-SQUARES REGRESSION:\nMartens H., NÊs T. Multivariate Calibration. Wiley: New York, 1989.\nRe-interpretation of NIPALS results solves PLSR inconsistency problem. Rolf Ergon. Published in Journal of Chemometrics 2009; Vol. 23/1: 72-75\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.PartialLeastSquares-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.PartialLeastSquares",
    "category": "method",
    "text": "(M::PartialLeastSquares)\n\nMakes an inference from X using a PartialLeastSquares object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.PrincipalComponentRegression-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.PrincipalComponentRegression",
    "category": "method",
    "text": "(M::PrincipalComponentRegression)( X )\n\nMakes an inference from X using a PrincipalComponentRegression object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.PrincipalComponentRegression-Tuple{PCA,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.PrincipalComponentRegression",
    "category": "method",
    "text": "PrincipalComponentRegression(PCAObject, Y )\n\nMakes a PrincipalComponentRegression model object from a PCA Object and property value Y.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.RidgeRegression-Tuple{Any,Any,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.RidgeRegression",
    "category": "method",
    "text": "RidgeRegression( X, Y, Penalty; Bias = false )\n\nMakes a RidgeRegression model of the form Y = AX with or without a Bias term and has an L2 Penalty. Returns a CLS object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.RidgeRegression-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.RidgeRegression",
    "category": "method",
    "text": "(M::RidgeRegression)(X)\n\nMakes an inference from X using a RidgeRegression object which wraps a ClassicLeastSquares object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.ExtremeLearningMachine",
    "page": "Regression Models",
    "title": "ChemometricsTools.ExtremeLearningMachine",
    "category": "function",
    "text": "ExtremeLearningMachine(X, Y, ReservoirSize = 10; ActivationFn = sigmoid)\n\nReturns a ELM regression model object from arrays X and Y, with a user specified ReservoirSize and ActivationFn.\n\nExtreme learning machine: a new learning scheme of feedforward neural networks. Guang-Bin Huang ; Qin-Yu Zhu ; Chee-Kheong Siew. 	2004 IEEE International Joint...\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.KernelRidgeRegression-Tuple{Any,Any,Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.KernelRidgeRegression",
    "category": "method",
    "text": "KernelRidgeRegression( X, Y, Penalty; KernelParameter = 0.0, KernelType = \"linear\" )\n\nMakes a KernelRidgeRegression model of the form Y = AK using a user specified Kernel(\"Linear\", or \"Guassian\") and has an L2 Penalty. Returns a KRR Wrapper for a CLS object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.sigmoid-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.sigmoid",
    "category": "method",
    "text": "sigmoid(x)\n\nApplies the sigmoid function to a scalar value X. Returns a scalar. Can be broad-casted over an Array.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.ELM-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.ELM",
    "category": "method",
    "text": "(M::ELM)(X)\n\nMakes an inference from X using a ELM object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#ChemometricsTools.KRR-Tuple{Any}",
    "page": "Regression Models",
    "title": "ChemometricsTools.KRR",
    "category": "method",
    "text": "(M::KRR)(X)\n\nMakes an inference from X using a KRR object which wraps a ClassicLeastSquares object.\n\n\n\n\n\n"
},

{
    "location": "man/RegressionModels/#Functions-1",
    "page": "Regression Models",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"RegressionModels.jl\"]"
},

{
    "location": "man/regressMetrics/#",
    "page": "Regression Metrics",
    "title": "Regression Metrics",
    "category": "page",
    "text": ""
},

{
    "location": "man/regressMetrics/#Regression-Metrics-API-Reference-1",
    "page": "Regression Metrics",
    "title": "Regression Metrics API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/regressMetrics/#ChemometricsTools.MAE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.MAE",
    "category": "method",
    "text": "MAE( y, yhat )\n\nCalculates Mean Average Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.MAPE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.MAPE",
    "category": "method",
    "text": "MAPE( y, yhat )\n\nCalculates Mean Average Percent Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.ME-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.ME",
    "category": "method",
    "text": "ME( y, yhat )\n\nCalculates Mean Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.MSE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.MSE",
    "category": "method",
    "text": "MSE( y, yhat )\n\nCalculates Mean Squared Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.PearsonCorrelationCoefficient-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.PearsonCorrelationCoefficient",
    "category": "method",
    "text": "PearsonCorrelationCoefficient( y, yhat )\n\nCalculates The Pearson Correlation Coefficient from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.PercentRMSE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.PercentRMSE",
    "category": "method",
    "text": "PercentRMSE( y, yhat )\n\nCalculates Percent Root Mean Squared Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.RMSE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.RMSE",
    "category": "method",
    "text": "RMSE( y, yhat )\n\nCalculates Root Mean Squared Error from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.RSquare-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.RSquare",
    "category": "method",
    "text": "RSquare( y, yhat )\n\nCalculates R^2 from Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.SSE-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.SSE",
    "category": "method",
    "text": "SSE( y, yhat )\n\nCalculates Sum of Squared Errors from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.SSReg-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.SSReg",
    "category": "method",
    "text": "SSReg( y, yhat )\n\nCalculates Sum of Squared Deviations due to Regression from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.SSRes-Tuple{Any,Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.SSRes",
    "category": "method",
    "text": "SSRes( y, yhat )\n\nCalculates Sum of Squared Residuals from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#ChemometricsTools.SSTotal-Tuple{Any}",
    "page": "Regression Metrics",
    "title": "ChemometricsTools.SSTotal",
    "category": "method",
    "text": "SSTotal( y, yhat )\n\nCalculates Total Sum of Squared Deviations from vectors Y and YHat\n\n\n\n\n\n"
},

{
    "location": "man/regressMetrics/#Functions-1",
    "page": "Regression Metrics",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"RegressionMetrics.jl\"]"
},

{
    "location": "man/ClassificationModels/#",
    "page": "Classification Models",
    "title": "Classification Models",
    "category": "page",
    "text": ""
},

{
    "location": "man/ClassificationModels/#Classification-Models-API-Reference-1",
    "page": "Classification Models",
    "title": "Classification Models API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.GaussianDiscriminant-Tuple{Any,Any,Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.GaussianDiscriminant",
    "category": "method",
    "text": "GaussianDiscriminant(M, X, Y; Factors = nothing)\n\nReturns a GaussianDiscriminant classification model on basis object M (PCA, LDA) and one hot encoded Y.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.GaussianDiscriminant-Tuple{Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.GaussianDiscriminant",
    "category": "method",
    "text": "( model::GaussianDiscriminant )( Z; Factors = size(model.ProjectedClassMeans)[2] )\n\nReturns a 1 hot encoded inference from Z using a GaussianDiscriminant object.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.GaussianNaiveBayes-Tuple{Any,Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.GaussianNaiveBayes",
    "category": "method",
    "text": "GaussianNaiveBayes(X,Y)\n\nReturns a GaussianNaiveBayes classification model object from X and one hot encoded Y.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.GaussianNaiveBayes-Tuple{Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.GaussianNaiveBayes",
    "category": "method",
    "text": "(gnb::GaussianNaiveBayes)(X)\n\nReturns a 1 hot encoded inference from X using a GaussianNaiveBayes object.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.KNN",
    "page": "Classification Models",
    "title": "ChemometricsTools.KNN",
    "category": "type",
    "text": "KNN( X, Y; DistanceType::String )\n\nDistanceType can be \"euclidean\", \"manhattan\". Y Must be one hot encoded.\n\nReturns a KNN classification model.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.KNN-Tuple{Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.KNN",
    "category": "method",
    "text": "( model::KNN )( Z; K = 1 )\n\nReturns a 1 hot encoded inference from X with K Nearest Neighbors, using a KNN object.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.LogisticRegression-Tuple{Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.LogisticRegression",
    "category": "method",
    "text": "( model::LogisticRegression )( X )\n\nReturns a 1 hot encoded inference from X using a LogisticRegression object.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#ChemometricsTools.MultinomialSoftmaxRegression-Tuple{Any,Any}",
    "page": "Classification Models",
    "title": "ChemometricsTools.MultinomialSoftmaxRegression",
    "category": "method",
    "text": "MultinomialSoftmaxRegression(X, Y; LearnRate = 1e-3, maxiters = 1000, L2 = 0.0)\n\nReturns a LogisticRegression classification model made by Stochastic Gradient Descent.\n\n\n\n\n\n"
},

{
    "location": "man/ClassificationModels/#Functions-1",
    "page": "Classification Models",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"ClassificationModels.jl\"]"
},

{
    "location": "man/classMetrics/#",
    "page": "Classification Metrics",
    "title": "Classification Metrics",
    "category": "page",
    "text": ""
},

{
    "location": "man/classMetrics/#Classification-Metrics-API-Reference-1",
    "page": "Classification Metrics",
    "title": "Classification Metrics API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/classMetrics/#ChemometricsTools.ColdToHot-Tuple{Any,ChemometricsTools.ClassificationLabel}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.ColdToHot",
    "category": "method",
    "text": "ColdToHot(Y, Schema::ClassificationLabel)\n\nTurns a cold encoded Y vector into a one hot encoded array.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.HighestVote-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.HighestVote",
    "category": "method",
    "text": "HighestVote(yhat)\n\nReturns the column index for each row that has the highest value in one hot encoded yhat. Returns a one cold encoded vector.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.HighestVoteOneHot-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.HighestVoteOneHot",
    "category": "method",
    "text": "HighestVoteOneHot(yhat)\n\nTurns the highest column-wise value to a 1 and the others to zeros per row in a one hot encoded yhat. Returns a one cold encoded vector.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.HotToCold-Tuple{Any,ChemometricsTools.ClassificationLabel}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.HotToCold",
    "category": "method",
    "text": "HotToCold(Y, Schema::ClassificationLabel)\n\nTurns a one hot encoded Y array into a cold encoded vector.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.IsColdEncoded-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.IsColdEncoded",
    "category": "method",
    "text": "IsColdEncoded(Y)\n\nReturns a boolean true if the array Y is cold encoded, and false if not.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.LabelEncoding-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.LabelEncoding",
    "category": "method",
    "text": "\"     LabelEncoding(HotOrCold)\n\nDetermines if an Array, Y, is one hot encoded, or cold encoded by it\'s dimensions. Returns a ClassificationLabel object/schema to convert between the formats.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.MulticlassStats-Tuple{Any,Any,Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.MulticlassStats",
    "category": "method",
    "text": "MulticlassStats(Y, GT, schema; Microaverage = true)\n\nCalculates many essential classification statistics based on predicted values Y, and ground truth values GT, using the encoding schema. Returns a dictionary of many statistics...\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.MulticlassThreshold-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.MulticlassThreshold",
    "category": "method",
    "text": "MulticlassThreshold(yhat; level = 0.5)\n\nEffectively does the same thing as Threshold() but per-row across columns.\n\nWarning this function can allow for no class assignments. HighestVote is preferred\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#ChemometricsTools.Threshold-Tuple{Any}",
    "page": "Classification Metrics",
    "title": "ChemometricsTools.Threshold",
    "category": "method",
    "text": "Threshold(yhat; level = 0.5)\n\nFor a binary vector yhat this decides if the label is a 0 or a 1 based on it\'s value relative to a threshold level.\n\n\n\n\n\n"
},

{
    "location": "man/classMetrics/#Functions-1",
    "page": "Classification Metrics",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"ClassificationMetrics.jl\"]"
},

{
    "location": "man/Trees/#",
    "page": "Tree Methods",
    "title": "Tree Methods",
    "category": "page",
    "text": ""
},

{
    "location": "man/Trees/#Tree-Methods-API-Reference-1",
    "page": "Tree Methods",
    "title": "Tree Methods API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Trees/#ChemometricsTools.ClassificationTree-Tuple{Any,Any}",
    "page": "Tree Methods",
    "title": "ChemometricsTools.ClassificationTree",
    "category": "method",
    "text": "ClassificationTree(x, y; gainfn = entropy, maxdepth = 4, minbranchsize = 3)\n\nBuilds a CART object using either gini or entropy as a partioning method. Y must be a one hot encoded 2-Array. Predictions can be formed by calling the following function from the CART object: (M::CART)(x).\n\n*Note: this is a purely nonrecursive decision tree. The julia compiler doesn\'t like storing structs of nested things. I wrote it the recursive way in the past and it was quite slow, I think this is true also of interpretted languages like R/Python...So here it is, nonrecursive tree\'s!\n\n\n\n\n\n"
},

{
    "location": "man/Trees/#ChemometricsTools.OneHotOdds-Tuple{Any}",
    "page": "Tree Methods",
    "title": "ChemometricsTools.OneHotOdds",
    "category": "method",
    "text": "OneHotOdds(Y)\n\nCalculates the odds of a one-hot formatted probability matrix. Returns a tuple.\n\n\n\n\n\n"
},

{
    "location": "man/Trees/#ChemometricsTools.entropy-Tuple{Any}",
    "page": "Tree Methods",
    "title": "ChemometricsTools.entropy",
    "category": "method",
    "text": "entropy(v)\n\nCalculates the Shannon-Entropy of a probability vector v. Returns a scalar. A common gain function used in tree methods.\n\n\n\n\n\n"
},

{
    "location": "man/Trees/#ChemometricsTools.gini-Tuple{Any}",
    "page": "Tree Methods",
    "title": "ChemometricsTools.gini",
    "category": "method",
    "text": "gini(p)\n\nCalculates the GINI coefficient of a probability vector p. Returns a scalar. A common gain function used in tree methods.\n\n\n\n\n\n"
},

{
    "location": "man/Trees/#ChemometricsTools.ssd-Tuple{Any,Any}",
    "page": "Tree Methods",
    "title": "ChemometricsTools.ssd",
    "category": "method",
    "text": "ssd(p)\n\nCalculates the sum squared deviations from a decision tree split. Accepts a vector of values, and the mean of that  vector. Returns a scalar. A common gain function used in tree methods.\n\n\n\n\n\n"
},

{
    "location": "man/Trees/#Functions-1",
    "page": "Tree Methods",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Trees.jl\"]"
},

{
    "location": "man/Ensemble/#",
    "page": "Ensemble Models",
    "title": "Ensemble Models",
    "category": "page",
    "text": ""
},

{
    "location": "man/Ensemble/#Ensemble-Models-API-Reference-1",
    "page": "Ensemble Models",
    "title": "Ensemble Models API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Ensemble/#ChemometricsTools.RandomForest",
    "page": "Ensemble Models",
    "title": "ChemometricsTools.RandomForest",
    "category": "type",
    "text": "RandomForest(x, y, mode = :classification; gainfn = entropy, trees = 50, maxdepth = 10,  minbranchsize = 5, samples = 0.7, maxvars = nothing)\n\nReturns a classification (mode = :classification) or a regression (mode = :regression) random forest model. The gainfn can be entropy or gini for classification or ssd for regression. If the number of maximumvars is not provided it will default to sqrt(variables) for classification or variables/3 for regression.\n\nThe returned object can be used for inference by calling new data on the object as a function.\n\nBreiman, L. Machine Learning (2001) 45: 5. https://doi.org/10.1023/A:1010933404324\n\n\n\n\n\n"
},

{
    "location": "man/Ensemble/#ChemometricsTools.RandomForest-Tuple{Any}",
    "page": "Ensemble Models",
    "title": "ChemometricsTools.RandomForest",
    "category": "method",
    "text": "(RF::RandomForest)(X)\n\nReturns bagged prediction vector of random forest model.\n\n\n\n\n\n"
},

{
    "location": "man/Ensemble/#ChemometricsTools.MakeIntervals",
    "page": "Ensemble Models",
    "title": "ChemometricsTools.MakeIntervals",
    "category": "function",
    "text": "MakeIntervals( columns::Int, intervalsize::Union{Array, Tuple} = [20, 50, 100] )\n\nCreates an Dictionary whose key is the interval size and values are an array of intervals from the range: 1 - columns of size intervalsize.\n\n\n\n\n\n"
},

{
    "location": "man/Ensemble/#ChemometricsTools.MakeIntervals",
    "page": "Ensemble Models",
    "title": "ChemometricsTools.MakeIntervals",
    "category": "function",
    "text": "MakeIntervals( columns::Int, intervalsize::Int = 20 )\n\nReturns an 1-Array of intervals from the range: 1 - columns of size intervalsize.\n\n\n\n\n\n"
},

{
    "location": "man/Ensemble/#ChemometricsTools.stackedweights-Tuple{Any}",
    "page": "Ensemble Models",
    "title": "ChemometricsTools.stackedweights",
    "category": "method",
    "text": "stackedweights(ErrVec; power = 2)\n\nWeights stacked interval errors by the reciprocal power specified. Used for SIPLS, SISPLS, etc.\n\nNi, W. , Brown, S. D. and Man, R. (2009), Stacked partial least squares regression analysis for spectral calibration and prediction. J. Chemometrics, 23: 505-517. doi:10.1002/cem.1246\n\n\n\n\n\n"
},

{
    "location": "man/Ensemble/#Functions-1",
    "page": "Ensemble Models",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Ensembles.jl\"]"
},

{
    "location": "man/Clustering/#",
    "page": "Clustering",
    "title": "Clustering",
    "category": "page",
    "text": ""
},

{
    "location": "man/Clustering/#Clustering-API-Reference-1",
    "page": "Clustering",
    "title": "Clustering API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Clustering/#ChemometricsTools.BetweenClusterSS-Tuple{ChemometricsTools.ClusterModel}",
    "page": "Clustering",
    "title": "ChemometricsTools.BetweenClusterSS",
    "category": "method",
    "text": "BetweenClusterSS( Clustered::ClusterModel )\n\nReturns a scalar of the between cluster sum of squares for a ClusterModel object.\n\n\n\n\n\n"
},

{
    "location": "man/Clustering/#ChemometricsTools.KMeans-Tuple{Any,Any}",
    "page": "Clustering",
    "title": "ChemometricsTools.KMeans",
    "category": "method",
    "text": "KMeans( X, Clusters; tolerance = 1e-8, maxiters = 200 )\n\nReturns a ClusterModel object after finding clusterings for data in X via MacQueens K-Means algorithm. Clusters is the K parameter, or the # of clusters.\n\nMacQueen, J. B. (1967). Some Methods for classification and Analysis of Multivariate Observations. Proceedings of 5th Berkeley Symposium on Mathematical Statistics and Probability. 1. University of California Press. pp. 281–297.\n\n\n\n\n\n"
},

{
    "location": "man/Clustering/#ChemometricsTools.TotalClusterSS-Tuple{ChemometricsTools.ClusterModel}",
    "page": "Clustering",
    "title": "ChemometricsTools.TotalClusterSS",
    "category": "method",
    "text": "TotalClusterSS( Clustered::ClusterModel )\n\nReturns a scalar of the total sum of squares for a ClusterModel object.\n\n\n\n\n\n"
},

{
    "location": "man/Clustering/#ChemometricsTools.WithinClusterSS-Tuple{ChemometricsTools.ClusterModel}",
    "page": "Clustering",
    "title": "ChemometricsTools.WithinClusterSS",
    "category": "method",
    "text": "WithinClusterSS( Clustered::ClusterModel )\n\nReturns a scalar of the within cluter sum of squares for a ClusterModel object.\n\n\n\n\n\n"
},

{
    "location": "man/Clustering/#Functions-1",
    "page": "Clustering",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"Clustering.jl\"]"
},

{
    "location": "man/AnomalyDetection/#",
    "page": "Anomaly Detection",
    "title": "Anomaly Detection",
    "category": "page",
    "text": ""
},

{
    "location": "man/AnomalyDetection/#Anomaly-Detection-API-Reference-1",
    "page": "Anomaly Detection",
    "title": "Anomaly Detection API Reference",
    "category": "section",
    "text": "ChemometricsTools has a few anomaly detection methods. Feel free to read the API below. If that\'s too abstract, check out the shoot-out example : AnomalyDetection"
},

{
    "location": "man/AnomalyDetection/#ChemometricsTools.Hotelling-Tuple{Any,PCA}",
    "page": "Anomaly Detection",
    "title": "ChemometricsTools.Hotelling",
    "category": "method",
    "text": "Hotelling(X, pca::PCA; Quantile = 0.05, Variance = 1.0)\n\nComputes the hotelling Tsq and upper control limit cut off of a pca object using a specified Quantile and cumulative variance explained Variance for new or old data X.\n\nA review of PCA-based statistical process monitoring methodsfor time-dependent, high-dimensional data. Bart De Ketelaere https://wis.kuleuven.be/stat/robust/papers/2013/deketelaere-review.pdf\n\n\n\n\n\n"
},

{
    "location": "man/AnomalyDetection/#ChemometricsTools.Leverage-Tuple{PCA}",
    "page": "Anomaly Detection",
    "title": "ChemometricsTools.Leverage",
    "category": "method",
    "text": "Leverage(pca::PCA)\n\nCalculates the leverage of samples in a pca object.\n\n\n\n\n\n"
},

{
    "location": "man/AnomalyDetection/#ChemometricsTools.Q-Tuple{Any,PCA}",
    "page": "Anomaly Detection",
    "title": "ChemometricsTools.Q",
    "category": "method",
    "text": "Q(X, pca::PCA; Quantile = 0.95, Variance = 1.0)\n\nComputes the Q-statistic and upper control limit cut off of a pca object using a specified Quantile and cumulative variance explained Variance for new or old data X.\n\nA review of PCA-based statistical process monitoring methodsfor time-dependent, high-dimensional data. Bart De Ketelaere https://wis.kuleuven.be/stat/robust/papers/2013/deketelaere-review.pdf\n\n\n\n\n\n"
},

{
    "location": "man/AnomalyDetection/#Functions-1",
    "page": "Anomaly Detection",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"AnomalyDetection.jl\"]"
},

{
    "location": "man/CurveResolution/#",
    "page": "Curve Resolution",
    "title": "Curve Resolution",
    "category": "page",
    "text": ""
},

{
    "location": "man/CurveResolution/#Curve-Resolution-Models-API-Reference-1",
    "page": "Curve Resolution",
    "title": "Curve Resolution Models API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/CurveResolution/#ChemometricsTools.BTEM",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.BTEM",
    "category": "function",
    "text": "BTEM(X, bands = nothing; Factors = 3, particles = 50, maxiters = 1000)\n\nReturns a single recovered spectra from a 2-Array X, the selected bands, number of Factors, using a Particle Swarm Optimizer.\n\nNote: This is not the function used in the original paper. This will be updated... it was written from memory. Also the original method uses Simulated Annealing not PSO. Band-Target Entropy Minimization (BTEM):  An Advanced Method for Recovering Unknown Pure Component Spectra. Application to the FTIR Spectra of Unstable Organometallic Mixtures. Wee Chew,Effendi Widjaja, and, and Marc Garland. Organometallics 2002 21 (9), 1982-1990. DOI: 10.1021/om0108752\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#ChemometricsTools.BTEMobjective-Tuple{Any,Any}",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.BTEMobjective",
    "category": "method",
    "text": "BTEMobjective( a, X )\n\nReturns the scalar BTEM objective function obtained from the linear combination vector a and loadings X.\n\nNote: This is not the function used in the original paper. This will be updated... it was written from memory.\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#ChemometricsTools.FNNLS-Tuple{Any,Any}",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.FNNLS",
    "category": "method",
    "text": "FNNLS(A, b; LHS = false, maxiters = 520)\n\nUses an implementation of Bro et. al\'s Fast Non-Negative Least Squares on the matrix A and vector b. We can state whether to pose the problem has a left-hand side problem (LHS = true) or a right hand side problem (default). Returns regression coefficients in the form of a vector.\n\nNote: this function does not have guarantees. Use at your own risk for now. Fast Non-Negative Least Squares algorithm based on Bro, R., & de Jong, S. (1997) A fast non-negativity-constrained least squares algorithm. Journal of Chemometrics, 11, 393-401.\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#ChemometricsTools.MCRALS",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.MCRALS",
    "category": "function",
    "text": "MCRALS(X, C, S = nothing; norm = (false, false), Factors = 1, maxiters = 20, nonnegative = (false, false) )\n\nPerforms Multivariate Curve Resolution using Alternating Least Squares on X taking initial estimates for S or C. S or C can be constrained by their norm, or by nonnegativity using nonnegative arguments. The number of resolved Factors can also be set.\n\nTauler, R. Izquierdo-Ridorsa, A. Casassas, E. Simultaneous analysis of several spectroscopic titrations with self-modelling curve resolution.Chemometrics and Intelligent Laboratory Systems. 18, 3, (1993), 293-300.\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#ChemometricsTools.NMF-Tuple{Any}",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.NMF",
    "category": "method",
    "text": "NMF(X; Factors = 1, tolerance = 1e-7, maxiters = 200)\n\nPerforms a variation of non-negative matrix factorization on Array X and returns the a 2-Tuple of (Concentration Profile, Spectra)\n\nNote: This is not a coordinate descent based NMF. This is a simple fast version which works well enough for chemical signals Algorithms for non-negative matrix factorization. Daniel D. Lee. H. Sebastian Seung. NIPS\'00 Proceedings of the 13th International Conference on Neural Information Processing Systems. 535-54\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#ChemometricsTools.SIMPLISMA-Tuple{Any}",
    "page": "Curve Resolution",
    "title": "ChemometricsTools.SIMPLISMA",
    "category": "method",
    "text": "SIMPLISMA(X; Factors = 1)\n\nPerforms SIMPLISMA on Array X. Returns a tuple of the following form: (Concentraion Profile, Pure Spectral Estimates, Pure Variables)\n\nNote: This is not the traditional SIMPLISMA algorithm presented by Willem Windig. REAL-TIME WAVELET COMPRESSION AND SELF-MODELING CURVE RESOLUTION FOR ION MOBILITY SPECTROMETRY. PhD. Dissertation. 2003. Guoxiang Chen.\n\n\n\n\n\n"
},

{
    "location": "man/CurveResolution/#Functions-1",
    "page": "Curve Resolution",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"CurveResolution.jl\"]"
},

{
    "location": "man/Stats/#",
    "page": "Stats.",
    "title": "Stats.",
    "category": "page",
    "text": ""
},

{
    "location": "man/Stats/#Stats-API-Reference-1",
    "page": "Stats.",
    "title": "Stats API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Stats/#ChemometricsTools.RunningMean-Tuple{Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.RunningMean",
    "category": "method",
    "text": "RunningMean(x)\n\nConstructs a running mean object with an initial scalar value of x.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.RunningVar-Tuple{Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.RunningVar",
    "category": "method",
    "text": "RunningVar(x)\n\nConstructs a RunningVar object with an initial scalar value of x. Note: RunningVar objects implicitly calculate the running mean.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.EmpiricalQuantiles-Tuple{Any,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.EmpiricalQuantiles",
    "category": "method",
    "text": "EmpiricalQuantiles(X, quantiles)\n\nFinds the column-wise quantiles of 2-Array X and returns them in a 2-Array of size quantiles by variables. *Note: This copies the array... Use a subset if memory is the concern. *\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Mean-Tuple{RunningMean}",
    "page": "Stats.",
    "title": "ChemometricsTools.Mean",
    "category": "method",
    "text": "Mean(rv::RunningMean)\n\nReturns the current mean inside of a RunningMean object.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Mean-Tuple{RunningVar}",
    "page": "Stats.",
    "title": "ChemometricsTools.Mean",
    "category": "method",
    "text": "Mean(rv::RunningVar)\n\nReturns the current mean inside of a RunningVar object.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Remove!-Tuple{RunningMean,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.Remove!",
    "category": "method",
    "text": "Remove!(RM::RunningMean, x)\n\nRemoves an observation(x) from a RunningMean object(RM) and reculates the mean in place.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Remove-Tuple{RunningMean,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.Remove",
    "category": "method",
    "text": "Remove!(RM::RunningMean, x)\n\nRemoves an observation(x) from a RunningMean object(RM) and recuturns the new RunningMean object.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Update!-Tuple{RunningMean,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.Update!",
    "category": "method",
    "text": "Update!(RM::RunningMean, x)\n\nAdds new observation(x) to a RunningMean object(RM) in place.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Update!-Tuple{RunningVar,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.Update!",
    "category": "method",
    "text": "Update!(RV::RunningVar, x)\n\nAdds new observation(x) to a RunningVar object(RV) and updates it in place.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Update-Tuple{RunningMean,Any}",
    "page": "Stats.",
    "title": "ChemometricsTools.Update",
    "category": "method",
    "text": "Update!(RM::RunningMean, x)\n\nAdds new observation(x) to a RunningMean object(RM) and returns the new object.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.Variance-Tuple{RunningVar}",
    "page": "Stats.",
    "title": "ChemometricsTools.Variance",
    "category": "method",
    "text": "Variance(rv::RunningVar)\n\nReturns the current variance inside of a RunningVar object.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#ChemometricsTools.rbinomial-Tuple{Any,Vararg{Any,N} where N}",
    "page": "Stats.",
    "title": "ChemometricsTools.rbinomial",
    "category": "method",
    "text": "rbinomial( p, size... )\n\nMakes an N-dimensional array of size(s) size with a probability of being a 1 over a 0 of 1 p.\n\n\n\n\n\n"
},

{
    "location": "man/Stats/#Functions-1",
    "page": "Stats.",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"InHouseStats.jl\"]"
},

{
    "location": "man/Dists/#",
    "page": "Distance Measures",
    "title": "Distance Measures",
    "category": "page",
    "text": ""
},

{
    "location": "man/Dists/#Distances-API-Reference-1",
    "page": "Distance Measures",
    "title": "Distances API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/Dists/#ChemometricsTools.Kernel-Tuple{Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.Kernel",
    "category": "method",
    "text": "(K::Kernel)(X)\n\nThis is a convenience function to allow for one-line construction of kernels from a Kernel object K and new data X.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.EuclideanDistance-Tuple{Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.EuclideanDistance",
    "category": "method",
    "text": "EuclideanDistance(X, Y)\n\nReturns the euclidean distance matrix of X and Y such that the columns are the samples in Y.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.EuclideanDistance-Tuple{Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.EuclideanDistance",
    "category": "method",
    "text": "EuclideanDistance(X)\n\nReturns the Grahm aka the euclidean distance matrix of X.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.GaussianKernel-Tuple{Any,Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.GaussianKernel",
    "category": "method",
    "text": "GaussianKernel(X, Y, sigma)\n\nCreates a Gaussian/RBF kernel from Arrays X and Y with hyperparameter sigma.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.GaussianKernel-Tuple{Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.GaussianKernel",
    "category": "method",
    "text": "GaussianKernel(X, sigma)\n\nCreates a Gaussian/RBF kernel from Array X using hyperparameter sigma.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.LinearKernel-Tuple{Any,Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.LinearKernel",
    "category": "method",
    "text": "LinearKernel(X, Y, c)\n\nCreates a Linear kernel from Arrays X and Y with hyperparameter C.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.LinearKernel-Tuple{Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.LinearKernel",
    "category": "method",
    "text": "LinearKernel(X, c)\n\nCreates a Linear kernel from Array X and hyperparameter C.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.ManhattanDistance-Tuple{Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.ManhattanDistance",
    "category": "method",
    "text": "ManhattanDistance(X, Y)\n\nReturns the Manhattan distance matrix of X and Y such that the columns are the samples in Y.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.ManhattanDistance-Tuple{Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.ManhattanDistance",
    "category": "method",
    "text": "ManhattanDistance(X)\n\nReturns the Manhattan distance matrix of X.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.SquareEuclideanDistance-Tuple{Any,Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.SquareEuclideanDistance",
    "category": "method",
    "text": "SquareEuclideanDistance(X, Y)\n\nReturns the squared euclidean distance matrix of X and Y such that the columns are the samples in Y.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#ChemometricsTools.SquareEuclideanDistance-Tuple{Any}",
    "page": "Distance Measures",
    "title": "ChemometricsTools.SquareEuclideanDistance",
    "category": "method",
    "text": "SquareEuclideanDistance(X)\n\nReturns the squared Grahm aka the euclidean distance matrix of X.\n\n\n\n\n\n"
},

{
    "location": "man/Dists/#Functions-1",
    "page": "Distance Measures",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"DistanceMeasures.jl\"]"
},

{
    "location": "man/PSO/#",
    "page": "PSO",
    "title": "PSO",
    "category": "page",
    "text": ""
},

{
    "location": "man/PSO/#Particle-Swarm-Optimizer-API-Reference-1",
    "page": "PSO",
    "title": "Particle Swarm Optimizer API Reference",
    "category": "section",
    "text": ""
},

{
    "location": "man/PSO/#ChemometricsTools.Bounds-Tuple{Any,Any,Any}",
    "page": "PSO",
    "title": "ChemometricsTools.Bounds",
    "category": "method",
    "text": "Bounds(dims)\n\nConstructor for a Bounds object. Returns a bounds object with a lower bound of [lower...] and upper bound[upper...] with length of dims.\n\n\n\n\n\n"
},

{
    "location": "man/PSO/#ChemometricsTools.Bounds-Tuple{Any}",
    "page": "PSO",
    "title": "ChemometricsTools.Bounds",
    "category": "method",
    "text": "Bounds(dims)\n\nDefault constructor for a Bounds object. Returns a bounds object with a lower bound of [0...] and upper bound[1...] with length of dims.\n\n\n\n\n\n"
},

{
    "location": "man/PSO/#ChemometricsTools.Particle-Tuple{Any,Any}",
    "page": "PSO",
    "title": "ChemometricsTools.Particle",
    "category": "method",
    "text": "Particle(ProblemBounds, VelocityBounds)\n\nDefault constructor for a Particle object. It creates a random unformly distributed particle within the specified ProblemBounds, and limits it\'s velocity to the specified VelocityBounds.\n\n\n\n\n\n"
},

{
    "location": "man/PSO/#ChemometricsTools.PSO-Tuple{Any,Bounds,Bounds,Int64}",
    "page": "PSO",
    "title": "ChemometricsTools.PSO",
    "category": "method",
    "text": "PSO(fn, Bounds, VelRange, Particles; tolerance = 1e-6, maxiters = 1000, InertialDecay = 0.5, PersonalWeight = 0.5, GlobalWeight = 0.5, InternalParams = nothing)\n\nMinimizes function fn with-in the user specified Bounds via a Particle Swarm Optimizer. The particle velocities are limitted to the VelRange. The number of particles are defined by the Particles parameter.\n\nReturns a Tuple of the following form: ( GlobalBestPos, GlobalBestScore, P ) Where P is an array of the particles used in the optimization.\n\n*Note: if the optimization function requires an additional constant parameter, please pass that parameter to InternalParams. This will only work if the optimized parameter(o) and constant parameter(c) for the function of interest has the following format: F(o,c) *\n\nKennedy, J.; Eberhart, R. (1995). Particle Swarm Optimization. Proceedings of IEEE International Conference on Neural Networks. IV. pp. 1942–1948. doi:10.1109/ICNN.1995.488968\n\n\n\n\n\n"
},

{
    "location": "man/PSO/#Functions-1",
    "page": "PSO",
    "title": "Functions",
    "category": "section",
    "text": "Modules = [ChemometricsTools]\nPages   = [\"PSO.jl\"]"
},

{
    "location": "man/FullAPI/#",
    "page": "Full API",
    "title": "Full API",
    "category": "page",
    "text": ""
},

{
    "location": "man/FullAPI/#ChemometricsTools.LDA-Tuple{Any,Any}",
    "page": "Full API",
    "title": "ChemometricsTools.LDA",
    "category": "method",
    "text": "LDA(X, Y; Factors = 1)\n\nCompute\'s a LinearDiscriminantAnalysis transform from x with a user specified number of latent variables(Factors). Returns an LDA object.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.LDA-Tuple{Any}",
    "page": "Full API",
    "title": "ChemometricsTools.LDA",
    "category": "method",
    "text": "( model::LDA )( Z; Factors = length(model.Values) )\n\nCalling a LDA object on new data brings the new data Z into the LDA basis.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.PCA-Tuple{Any}",
    "page": "Full API",
    "title": "ChemometricsTools.PCA",
    "category": "method",
    "text": "PCA(X; Factors = minimum(size(X)) - 1)\n\nCompute\'s a PCA from x using LinearAlgebra\'s SVD algorithm with a user specified number of latent variables(Factors). Returns a PCA object.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.PCA-Tuple{Array}",
    "page": "Full API",
    "title": "ChemometricsTools.PCA",
    "category": "method",
    "text": "(T::PCA)(Z::Array; Factors = length(T.Values), inverse = false)\n\nCalling a PCA object on new data brings the new data Z into or out of (inverse = true) the PCA basis.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.ExplainedVariance-Tuple{LDA}",
    "page": "Full API",
    "title": "ChemometricsTools.ExplainedVariance",
    "category": "method",
    "text": "ExplainedVariance(lda::LDA)\n\nCalculates the explained variance of each singular value in an LDA object.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.ExplainedVariance-Tuple{PCA}",
    "page": "Full API",
    "title": "ChemometricsTools.ExplainedVariance",
    "category": "method",
    "text": "ExplainedVariance(PCA::PCA)\n\nCalculates the explained variance of each singular value in a pca object.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.PCA_NIPALS-Tuple{Any}",
    "page": "Full API",
    "title": "ChemometricsTools.PCA_NIPALS",
    "category": "method",
    "text": "PCA_NIPALS(X; Factors = minimum(size(X)) - 1, tolerance = 1e-7, maxiters = 200)\n\nCompute\'s a PCA from x using the NIPALS algorithm with a user specified number of latent variables(Factors). The tolerance is the minimum change in the F norm before ceasing execution. Returns a PCA object.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#ChemometricsTools.findpeaks-Tuple{Any}",
    "page": "Full API",
    "title": "ChemometricsTools.findpeaks",
    "category": "method",
    "text": "findpeaks( vY; m = 3)\n\nFinds the indices of peaks in a vector vY with a window span of 2m. Original R function by Stas_G:(https://stats.stackexchange.com/questions/22974/how-to-find-local-peaks-valleys-in-a-series-of-data) This version is based on a C++ variant by me.\n\n\n\n\n\n"
},

{
    "location": "man/FullAPI/#API-1",
    "page": "Full API",
    "title": "API",
    "category": "section",
    "text": "CurrentModule = ChemometricsTools\nDocTestSetup = quote\n	using ChemometricsTools\nendModules = [ChemometricsTools]"
},

]}